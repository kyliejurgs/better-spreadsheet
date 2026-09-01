import { computed, Injectable, signal } from '@angular/core';
import { Workspace } from '../models/workspace';
import { WorkspaceData } from '../models/workspace-data';
import { getWorkspaceData, getWorkspaces } from '../data/workspace-data';

export type WorkspaceLoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Owns live application state for the current workspace.
 *
 * Components consume this service rather than reading IndexedDB directly. Signals represent the
 * live interface state; IndexedDB remains the durable source of truth
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

  // Loads workspace list and selects first available on initialization
  // Selection persistence can be added when navigation state is implemented
  async initialize(): Promise<void> {
    this.beginLoad();
    try {
      const workspaces = await getWorkspaces();
      this.workspaceStates.set(workspaces);

      if (workspaces.length === 0) {
        this.workspaceDataState.set(null);
        this.loadStateValue.set('ready');
        return;
      }

      await this.loadWorkspace(workspaces[0].id);
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
    } catch (error) {
      this.failLoad(error);
    }
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
