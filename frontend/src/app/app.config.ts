import { provideTaiga } from '@taiga-ui/core';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { WorkspaceService } from './services/workspace.service';
import { ApplicationService } from './services/application.service';
import { ApplicationUiStateService } from './services/application-ui-state.service';
import { WorkAreaService } from './services/work-area.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTaiga(),
    provideAppInitializer(async () => {
      const applicationService = inject(ApplicationService);
      const applicationUiStateService = inject(ApplicationUiStateService);
      const workspaceService = inject(WorkspaceService);
      const workAreaService = inject(WorkAreaService);

      await applicationService.initialize();
      await applicationUiStateService.initialize();
      await workspaceService.initialize();

      const workspaceId = workspaceService.currentWorkspace()?.id;
      if (workspaceId === undefined) {
        workAreaService.clearWorkspace();
        return;
      }
      await workAreaService.loadWorkspace(workspaceId);
    }),
  ],
};
