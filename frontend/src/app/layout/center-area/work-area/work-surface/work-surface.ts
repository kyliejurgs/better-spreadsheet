import { Component, computed, inject } from '@angular/core';
import { WorkAreaService } from '../../../../services/work-area.service';
import { WorkspaceService } from '../../../../services/workspace.service';

@Component({
  imports: [],
  selector: 'app-work-surface',
  styleUrl: './work-surface.css',
  templateUrl: './work-surface.html',
})
export class WorkSurface {
  private readonly workAreaService = inject(WorkAreaService);
  private readonly workspaceService = inject(WorkspaceService);

  readonly activeResourceName = computed(() => {
    const activeTab = this.workAreaService.activeTab();
    if (activeTab === null) {
      return null;
    }

    switch (activeTab.resourceType) {
      case 'view':
        return (
          this.workspaceService.views().find((view) => view.id === activeTab.resourceId)?.name ??
          null
        );
      default:
        return null;
    }
  });
}
