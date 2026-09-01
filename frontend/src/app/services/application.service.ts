import { Injectable } from '@angular/core';
import { ApplicationMetadata } from '../models/application-metadata';
import { getApplicationMetadata, saveApplicationMetadata } from '../data/application-data';
import { getWorkspaces, importApplicationData } from '../data/workspace-data';
import { loadStarterData } from '../data/starter-data';

/**
 * Coordinates application-level startup behavior before workspace state is loaded into interface.
 *
 * Starter installation is a first-run concern and therefore does not belong to WorkspaceService.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  async initialize(): Promise<void> {
    const metadata = await getApplicationMetadata();
    if (metadata !== null) {
      return;
    }
    await this.initializeFirstRun();
  }

  private async initializeFirstRun(): Promise<void> {
    const existingWorkspaces = await getWorkspaces();

    // A missing metadata record does not mean the database is empty. Preserve existing data.
    if (existingWorkspaces.length > 0) {
      await this.saveInitializedMetadata(existingWorkspaces[0].id);
      return;
    }

    const startData = await loadStarterData();
    await importApplicationData(startData);
    const selectedWorkspaceId = startData.workspaces[0]?.id ?? null;
    await this.saveInitializedMetadata(selectedWorkspaceId);
  }

  private async saveInitializedMetadata(selectedWorkspaceId: string | null): Promise<void> {
    const metadata: ApplicationMetadata = {
      id: 'application',
      starterDataInitialized: true,
      selectedWorkspaceId,
    };

    await saveApplicationMetadata(metadata);
  }
}
