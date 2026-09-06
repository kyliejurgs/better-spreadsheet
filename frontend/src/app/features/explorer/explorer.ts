import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import {
  TuiIcon,
  TuiDropdownDirective,
  TuiDropdownManual,
  TuiDataListComponent,
} from '@taiga-ui/core';
import { NgTemplateOutlet } from '@angular/common';
import { ExplorerSectionId } from '../../models/application-ui-state';
import { ApplicationUiStateService } from '../../services/application-ui-state.service';

type ExplorerNodeType = 'collection' | 'table' | 'view';

interface ExplorerNode {
  id: string;
  name: string;
  type: ExplorerNodeType;
  icon: string;
  children: readonly ExplorerNode[];
}

@Component({
  imports: [
    TuiIcon,
    NgTemplateOutlet,
    TuiDropdownDirective,
    TuiDropdownManual,
    TuiDataListComponent,
  ],
  selector: 'app-explorer',
  styleUrl: './explorer.css',
  templateUrl: './explorer.html',
})
export class Explorer {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly uiState = inject(ApplicationUiStateService);
  private readonly minSectionHeight = 100;

  readonly currentWorkspace = this.workspaceService.currentWorkspace;
  readonly workspaces = this.workspaceService.workspaces;
  readonly workspaceSwitcherOpen = signal(false);

  readonly sectionOrder: readonly ExplorerSectionId[] = ['workspace', 'files'];
  readonly sectionWeights = this.uiState.sectionWeights;
  readonly expandedExplorerSections = this.uiState.expandedExplorerSections;

  readonly expandedSectionIds = computed<readonly ExplorerSectionId[]>(() => {
    const expanded = this.expandedExplorerSections();
    return this.sectionOrder.filter((id) => expanded.has(id));
  });

  readonly tree = computed<readonly ExplorerNode[]>(() => {
    const collections = this.workspaceService
      .collections()
      .filter((collection) => collection.lifecycleState === 'active')
      .map((collection): ExplorerNode => ({
        id: collection.id,
        name: collection.name,
        type: 'collection',
        icon: '@font.package_2',
        children: this.buildTables(collection.id),
      }))
      .filter((collection) => collection.children.length > 0)
      .sort((a, b) => this.compareNames(a.name, b.name));

    return [...collections, ...this.buildTables(null)];
  });

  async toggleSection(id: ExplorerSectionId): Promise<void> {
    this.expandedExplorerSections.update((expanded) => this.toggleSetValue(expanded, id));
    await this.uiState.save();
  }

  isSectionExpanded(id: ExplorerSectionId): boolean {
    return this.expandedExplorerSections().has(id);
  }

  sectionWeight(id: ExplorerSectionId): number {
    if (!this.isSectionExpanded(id)) {
      return 0;
    }
    if (this.expandedSectionIds().length === 1) {
      return 1;
    }
    return this.sectionWeights()[id];
  }

  hasResizeHandleAfter(id: ExplorerSectionId): boolean {
    if (!this.isSectionExpanded(id)) {
      return false;
    }
    const index = this.expandedSectionIds().indexOf(id);
    return index >= 0 && index < this.expandedSectionIds().length - 1;
  }

  startSectionResize(event: PointerEvent, upperSectionId: ExplorerSectionId): void {
    const upperIndex = this.expandedSectionIds().indexOf(upperSectionId);
    const lowerSectionId = this.expandedSectionIds()[upperIndex + 1];
    if (!lowerSectionId) {
      return;
    }

    event.preventDefault();

    const upperElement = this.getSectionElement(upperSectionId);
    const lowerElement = this.getSectionElement(lowerSectionId);
    if (!upperElement || !lowerElement) {
      return;
    }

    const upperStartHeight = upperElement.getBoundingClientRect().height;
    const lowerStartHeight = lowerElement.getBoundingClientRect().height;
    const combinedHeight = upperStartHeight + lowerStartHeight;
    const startY = event.clientY;

    const minHeight = Math.min(this.minSectionHeight, combinedHeight / 2);
    const weights = this.sectionWeights();
    const combinedWeight = weights[upperSectionId] + weights[lowerSectionId];

    const onPointerMove = (moveEvent: PointerEvent): void => {
      const deltaY = moveEvent.clientY - startY;
      const upperHeight = Math.min(
        Math.max(upperStartHeight + deltaY, minHeight),
        combinedHeight - minHeight,
      );

      const upperRatio = upperHeight / combinedHeight;
      const upperWeight = combinedWeight * upperRatio;
      const lowerWeight = combinedWeight - upperWeight;

      this.setSectionWeight(upperSectionId, upperWeight);
      this.setSectionWeight(lowerSectionId, lowerWeight);
    };

    const onPointerUp = (): void => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      void this.uiState.save();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  async toggleCollection(id: string): Promise<void> {
    const workspaceId = this.currentWorkspace()?.id;
    if (!workspaceId) {
      return;
    }

    this.uiState.expandedCollections.update((state) => ({
      ...state,
      [workspaceId]: this.toggleArrayValue(state[workspaceId] ?? [], id),
    }));
    await this.uiState.save();
  }

  async toggleTable(id: string): Promise<void> {
    const workspaceId = this.currentWorkspace()?.id;
    if (!workspaceId) {
      return;
    }

    this.uiState.expandedTables.update((state) => ({
      ...state,
      [workspaceId]: this.toggleArrayValue(state[workspaceId] ?? [], id),
    }));
    await this.uiState.save();
  }

  isCollectionExpanded(id: string): boolean {
    const workspaceId = this.currentWorkspace()?.id;
    if (!workspaceId) {
      return false;
    }
    return (this.uiState.expandedCollections()[workspaceId] ?? []).includes(id);
  }

  isTableExpanded(id: string): boolean {
    const workspaceId = this.currentWorkspace()?.id;
    if (!workspaceId) {
      return false;
    }
    return (this.uiState.expandedTables()[workspaceId] ?? []).includes(id);
  }

  toggleWorkspaceSwitcher(event: MouseEvent): void {
    event.stopPropagation();
    this.workspaceSwitcherOpen.update((open) => !open);
  }

  async selectWorkspace(workspaceId: string): Promise<void> {
    if (workspaceId === this.currentWorkspace()?.id) {
      this.workspaceSwitcherOpen.set(false);
      return;
    }
    await this.workspaceService.selectWorkspace(workspaceId);
    this.workspaceSwitcherOpen.set(false);
  }

  private getSectionElement(id: ExplorerSectionId): HTMLElement | null {
    return document.querySelector(`[data-explorer-section="${id}"]`);
  }

  private setSectionWeight(id: ExplorerSectionId, weight: number): void {
    this.sectionWeights.update((weights) => ({ ...weights, [id]: weight }));
  }

  private buildTables(collectionId: string | null): ExplorerNode[] {
    return this.workspaceService
      .tables()
      .filter((table) => {
        return table.collectionId === collectionId && table.lifecycleState === 'active';
      })
      .sort((a, b) => this.compareNames(a.name, b.name))
      .map((table): ExplorerNode => ({
        id: table.id,
        name: table.name,
        type: 'table',
        icon: '@font.table',
        children: this.buildViews(table.id),
      }));
  }

  private buildViews(tableId: string): ExplorerNode[] {
    return this.workspaceService
      .views()
      .filter((view) => {
        return view.tableId === tableId && view.lifecycleState === 'active';
      })
      .sort((a, b) => {
        if (a.required !== b.required) {
          return a.required ? -1 : 1;
        }
        return this.compareNames(a.name, b.name);
      })
      .map((view): ExplorerNode => ({
        id: view.id,
        name: view.name,
        type: 'view',
        icon: '@font.visibility',
        children: [],
      }));
  }

  private toggleSetValue<T>(values: ReadonlySet<T>, value: T): ReadonlySet<T> {
    const updated = new Set(values);
    if (updated.has(value)) {
      updated.delete(value);
    } else {
      updated.add(value);
    }
    return updated;
  }

  private toggleArrayValue(values: readonly string[], value: string): readonly string[] {
    return values.includes(value) ? values.filter((id) => id !== value) : [...values, value];
  }

  private compareNames(a: string, b: string): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }
}
