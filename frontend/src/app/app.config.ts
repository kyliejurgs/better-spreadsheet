import { provideTaiga } from '@taiga-ui/core';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { WorkspaceService } from './services/workspace.service';
import { ApplicationService } from './services/application.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTaiga(),
    provideAppInitializer(async () => {
      const applicationService = inject(ApplicationService);
      const workspaceService = inject(WorkspaceService);
      await applicationService.initialize();
      await workspaceService.initialize();
    }),
  ],
};
