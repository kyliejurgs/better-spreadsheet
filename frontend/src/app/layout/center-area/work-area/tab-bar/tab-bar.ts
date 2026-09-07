import { Component, computed, inject } from '@angular/core';
import { WorkAreaService } from '../../../../services/work-area.service';
import { WorkspaceService } from '../../../../services/workspace.service';
import { TuiIcon } from '@taiga-ui/core';
import { View } from '../../../../models/view';

@Component({
  imports: [TuiIcon],
  selector: 'app-tab-bar',
  styleUrl: './tab-bar.css',
  templateUrl: './tab-bar.html',
})
export class TabBar {
  private readonly workAreaService = inject(WorkAreaService);
  private readonly workspaceService = inject(WorkspaceService);

  readonly activeTabId = this.workAreaService.activeTabId;

  readonly tabs = computed(() => {
    const views = this.workspaceService.views();
    const tables = this.workspaceService.tables();
    return this.workAreaService
      .openTabs()
      .map((tab) => {
        if (tab.resourceType !== 'view') {
          return null;
        }
        const view = views.find((candidate) => candidate.id === tab.resourceId);
        if (view === undefined) {
          return null;
        }

        const table = tables.find((candidate) => candidate.id === view.tableId);
        if (table === undefined) {
          return null;
        }

        return { ...tab, name: this.getViewTabName(view, views, table.name) };
      })
      .filter((tab) => tab !== null);
  });

  activateTab(resourceId: string): void {
    this.workAreaService.activateTab(resourceId);
  }

  closeTab(event: MouseEvent, resourceId: string): void {
    event.stopPropagation();
    this.workAreaService.closeTab(resourceId);
  }

  middleClickTab(event: MouseEvent, resourceId: string): void {
    if (event.button !== 1) {
      return;
    }
    event.preventDefault();
    this.workAreaService.closeTab(resourceId);
  }

  private getViewTabName(view: View, views: readonly View[], tableName: string): string {
    if (view.required) {
      return tableName;
    }

    const hasDuplicateName = views.some(
      (candidate) =>
        candidate.id !== view.id &&
        candidate.lifecycleState === 'active' &&
        this.sameName(candidate.name, view.name),
    );

    return hasDuplicateName ? `${view.name} [${tableName}]` : view.name;
  }

  private sameName(a: string, b: string): boolean {
    return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
  }
}
