import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import { TuiIcon } from '@taiga-ui/core';
import { NgTemplateOutlet } from '@angular/common';

type ExplorerNodeType = 'collection' | 'table' | 'view';

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

  readonly currentWorkspace = this.workspaceService.currentWorkspace;

  readonly workspaceExpanded = signal(true);
  readonly filesExpanded = signal(false);

  readonly expandedCollections = signal<ReadonlySet<string>>(new Set());
  readonly expandedTables = signal<ReadonlySet<string>>(new Set());

  readonly tree = computed<readonly ExplorerNode[]>(() => {
    const collections = this.workspaceService
      .collections()
      .filter((collection) => collection.lifecycleState === 'active')
      .map((collection): ExplorerNode => ({
        id: collection.id,
        name: collection.name,
        type: 'collection',
        icon: '@tui.package',
        children: this.buildTables(collection.id),
      }))
      .filter((collection) => collection.children.length > 0)
      .sort((a, b) => this.compareNames(a.name, b.name));

    return [...collections, ...this.buildTables(null)];
  });

  toggleWorkspace(): void {
    this.workspaceExpanded.update((expanded) => !expanded);
  }

  toggleFiles(): void {
    this.filesExpanded.update((expanded) => !expanded);
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
        icon: '@tui.table',
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
        icon: '@tui.eye',
        children: [],
      }));
  }

  private toggleSetValue(values: ReadonlySet<string>, id: string): ReadonlySet<string> {
    const updated = new Set(values);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    return updated;
  }

  private compareNames(a: string, b: string): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }
}
