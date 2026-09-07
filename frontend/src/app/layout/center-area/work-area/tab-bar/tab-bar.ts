import { Component, computed, inject } from '@angular/core';
import { WorkAreaService } from '../../../../services/work-area.service';
import { WorkspaceService } from '../../../../services/workspace.service';
import { TuiIcon } from '@taiga-ui/core';

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
        return { ...tab, name: view.name };
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
}
