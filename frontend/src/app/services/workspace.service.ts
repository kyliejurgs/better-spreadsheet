import { computed, Injectable, signal } from '@angular/core';
import { Workspace } from '../models/workspace';
import { WorkspaceData } from '../models/workspace-data';
import { getWorkspaceData, getWorkspaces } from '../data/workspace-data';
import { getApplicationMetadata, saveApplicationMetadata } from '../data/application-data';

export type WorkspaceLoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Owns live state for the currently selected workspace. Signals are the reactive interface state
 * while IndexedDB remains the durable source of truth.
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private readonly workspaceStates = signal<Workspace[]>([]);
  private readonly workspaceDataState = signal<WorkspaceData | null>(null);
  private readonly loadStateValue = signal<WorkspaceLoadState>('idle');
  private readonly errorState = signal<Error | null>(null);

  readonly workspaces = this.workspaceStates.asReadonly();
  readonly workspaceData = this.workspaceDataState.asReadonly();
  readonly loadState = this.loadStateValue.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Expose useful pieces of current workspace without duplicating collections into mutable state
  readonly currentWorkspace = computed(() => {
    return this.workspaceDataState()?.workspace ?? null;
  });
  readonly collections = computed(() => {
    return this.workspaceDataState()?.collections ?? [];
  });
  readonly tables = computed(() => {
    return this.workspaceDataState()?.tables ?? [];
  });
  readonly fields = computed(() => {
    return this.workspaceDataState()?.fields ?? [];
  });
  readonly records = computed(() => {
    return this.workspaceDataState()?.records ?? [];
  });
  readonly views = computed(() => {
    return this.workspaceDataState()?.views ?? [];
  });
  readonly sections = computed(() => {
    return this.workspaceDataState()?.sections ?? [];
  });

  /**
   * Restores the last valid selected workspace. If workspace no longer exists, first available
   * workspace becomes the new fallback.
   */
  async initialize(): Promise<void> {
    this.beginLoad();

    try {
      const [workspaces, metadata] = await Promise.all([getWorkspaces(), getApplicationMetadata()]);

      this.workspaceStates.set(workspaces);
      if (workspaces.length === 0) {
        this.workspaceDataState.set(null);
        await this.persistSelectedWorkspace(null);
        this.loadStateValue.set('ready');
        return;
      }

      const selectedWorkspaceId = this.resolveSelectedWorkspaceId(
        workspaces,
        metadata?.selectedWorkspaceId ?? null,
      );
      await this.loadWorkspace(selectedWorkspaceId);
      await this.persistSelectedWorkspace(selectedWorkspaceId);
    } catch (error) {
      this.failLoad(error);
    }
  }

  async selectWorkspace(workspaceId: string): Promise<void> {
    const exists = this.workspaceStates().some((workspace) => workspace.id === workspaceId);
    if (!exists) {
      throw new Error(`Unknown workspace: ${workspaceId}`);
    }

    this.beginLoad();

    try {
      await this.loadWorkspace(workspaceId);
      await this.persistSelectedWorkspace(workspaceId);
    } catch (error) {
      this.failLoad(error);
    }
  }

  private resolveSelectedWorkspaceId(
    workspaces: readonly Workspace[],
    selectedWorkspaceId: string | null,
  ): string {
    const selectedStillExists = workspaces.some((workspace) => {
      return workspace.id === selectedWorkspaceId;
    });

    if (selectedWorkspaceId !== null && selectedStillExists) {
      return selectedWorkspaceId;
    }

    return workspaces[0].id;
  }

  private async persistSelectedWorkspace(workspaceId: string | null): Promise<void> {
    const metadata = await getApplicationMetadata();
    if (metadata === null) {
      throw new Error('Application metadata has not been initialized.');
    }

    if (metadata.selectedWorkspaceId === workspaceId) {
      return;
    }

    await saveApplicationMetadata({
      ...metadata,
      selectedWorkspaceId: workspaceId,
    });
  }

  private async loadWorkspace(workspaceId: string): Promise<void> {
    const workspaceData = await getWorkspaceData(workspaceId);
    if (workspaceData === null) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    // Replace the loaded workspace atomically after finish assembling it. Components never observe a partially loaded hierarchy.
    this.workspaceDataState.set(workspaceData);
    this.loadStateValue.set('ready');
  }

  private beginLoad(): void {
    this.loadStateValue.set('loading');
    this.errorState.set(null);
  }

  private failLoad(error: unknown): void {
    const resolvedError = error instanceof Error ? error : new Error('Unable to load workspace');

    this.errorState.set(resolvedError);
    this.loadStateValue.set('error');
    console.error('Unable to load workspace.', resolvedError);
  }
}
