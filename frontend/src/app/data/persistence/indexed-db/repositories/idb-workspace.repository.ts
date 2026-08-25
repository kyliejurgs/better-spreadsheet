import { inject, Injectable } from '@angular/core';
import { WorkspaceRepository } from '../../../repositories/workspace.repository';
import { IdbService } from '../idb.service';
import { IDB_CONFIG } from '../idb.config';
import { Workspace } from '../../../models/workspace.model';
import { IdbStore } from '../idb.store';

@Injectable()
export class IdbWorkspaceRepository extends WorkspaceRepository {
  private readonly store = new IdbStore<Workspace>(
    inject(IdbService),
    IDB_CONFIG.stores.workspaces,
  );

  override getAll(): Promise<Workspace[]> {
    return this.store.getAll();
  }

  override getById(id: string): Promise<Workspace | undefined> {
    return this.store.getById(id);
  }

  override save(workspace: Workspace): Promise<void> {
    return this.store.save(workspace);
  }

  override delete(id: string): Promise<void> {
    return this.store.delete(id);
  }
}
