import { inject, Injectable } from '@angular/core';
import { CollectionRepository } from '../../../repositories/collection.repository';
import { IdbStore } from '../idb.store';
import { IdbService } from '../idb.service';
import { IDB_CONFIG } from '../idb.config';
import { Collection } from '../../../models/collection.model';

@Injectable()
export class IdbCollectionRepository extends CollectionRepository {
  private readonly store = new IdbStore<Collection>(
    inject(IdbService),
    IDB_CONFIG.stores.collections,
  );

  override getAll(): Promise<Collection[]> {
    return this.store.getAll();
  }

  override getById(id: string): Promise<Collection | undefined> {
    return this.store.getById(id);
  }

  override getByWorkspaceId(workspaceId: string): Promise<Collection[]> {
    return this.store.getByIndex(IDB_CONFIG.indexes.workspaceId, workspaceId);
  }

  override save(collection: Collection): Promise<void> {
    return this.store.save(collection);
  }

  override delete(id: string): Promise<void> {
    return this.store.delete(id);
  }
}
