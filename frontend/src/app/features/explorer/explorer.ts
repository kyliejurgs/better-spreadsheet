import { Component, computed, inject } from '@angular/core';
import { WorkspaceService } from '../../services/workspace.service';
import { TuiHandler } from '@taiga-ui/cdk/types';
import { TuiIcon } from '@taiga-ui/core';
import { TuiTree } from '@taiga-ui/kit';

type ExplorerNodeType = 'collection' | 'table' | 'view';

interface ExplorerNode {
  id: string;
  name: string;
  type: ExplorerNodeType;
  icon: string;
  children: readonly ExplorerNode[];
}

@Component({
  imports: [TuiIcon, TuiTree],
  selector: 'app-explorer',
  styleUrl: './explorer.css',
  templateUrl: './explorer.html',
})
export class Explorer {
  private readonly workspaceService = inject(WorkspaceService);

  readonly currentWorkspace = this.workspaceService.currentWorkspace;

  readonly tree = computed<readonly ExplorerNode[]>(() => {
    const collections = this.workspaceService
      .collections()
      .filter((collection) => collection.lifecycleState === 'active')
      .sort((a, b) => this.compareNames(a.name, b.name))
      .map((collection): ExplorerNode => ({
        id: collection.id,
        name: collection.name,
        type: 'collection',
        icon: '@tui.boxes',
        children: this.buildTables(collection.id),
      }));

    const rootTables = this.buildTables(null);
    return [...collections, ...rootTables];
  });

  readonly childrenHandler: TuiHandler<ExplorerNode, readonly ExplorerNode[]> = (item) =>
    item.children;

  private buildTables(collectionId: string | null): ExplorerNode[] {
    return this.workspaceService
      .tables()
      .filter((table) => {
        return table.collectionId === collectionId && table.lifecycleState === 'active';
      })
      .sort((a, b) => this.compareNames(a.name, b.name))
      .map((table) => ({
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

  private compareNames(a: string, b: string): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }
}
