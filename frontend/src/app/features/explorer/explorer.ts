import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import { TuiIcon } from '@taiga-ui/core';
import { NgTemplateOutlet } from '@angular/common';

type ExplorerNodeType = 'collection' | 'table' | 'view';
type ExplorerSectionId = 'workspace' | 'files';

interface ExplorerNode {
  id: string;
  name: string;
  type: ExplorerNodeType;
  icon: string;
  children: readonly ExplorerNode[];
}

@Component({
  imports: [TuiIcon, NgTemplateOutlet],
  selector: 'app-explorer',
  styleUrl: './explorer.css',
  templateUrl: './explorer.html',
})
export class Explorer {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly minSectionHeight = 200;

  readonly currentWorkspace = this.workspaceService.currentWorkspace;
  readonly sectionOrder: readonly ExplorerSectionId[] = ['workspace', 'files'];

  readonly sectionWeights = signal<Record<ExplorerSectionId, number>>({
    workspace: 1,
    files: 1,
  });

  readonly expandedSections = signal<ReadonlySet<ExplorerSectionId>>(new Set(['workspace']));
  readonly expandedCollections = signal<ReadonlySet<string>>(new Set());
  readonly expandedTables = signal<ReadonlySet<string>>(new Set());

  readonly expandedSectionIds = computed<readonly ExplorerSectionId[]>(() => {
    const expanded = this.expandedSections();
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

  toggleSection(id: ExplorerSectionId): void {
    this.expandedSections.update((expanded) => this.toggleSetValue(expanded, id));
  }

  isSectionExpanded(id: ExplorerSectionId): boolean {
    return this.expandedSections().has(id);
  }

  sectionWeight(id: ExplorerSectionId): number {
    return this.isSectionExpanded(id) ? this.sectionWeights()[id] : 0;
  }

  hasResizeHandleAfter(id: ExplorerSectionId): boolean {
    if (this.isSectionExpanded(id)) {
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
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  toggleCollection(id: string): void {
    this.expandedCollections.update((expanded) => this.toggleSetValue(expanded, id));
  }

  toggleTable(id: string): void {
    this.expandedTables.update((expanded) => this.toggleSetValue(expanded, id));
  }

  isCollectionExpanded(id: string): boolean {
    return this.expandedCollections().has(id);
  }

  isTableExpanded(id: string): boolean {
    return this.expandedTables().has(id);
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
  private compareNames(a: string, b: string): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }
}
