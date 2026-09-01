import { provideTaiga } from '@taiga-ui/core';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { WorkspaceService } from './services/workspace.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideTaiga(),
    provideAppInitializer(() => {
      return inject(WorkspaceService).initialize();
    }),
  ],
};
