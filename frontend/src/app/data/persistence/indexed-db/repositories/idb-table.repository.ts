import { inject, Injectable } from '@angular/core';
import { TableRepository } from '../../../repositories/table.repository';
import { IdbStore } from '../idb.store';
import { Table } from '../../../models/table.model';
import { IdbService } from '../idb.service';
import { IDB_CONFIG } from '../idb.config';

@Injectable()
export class IdbTableRepository extends TableRepository {
  private readonly store = new IdbStore<Table>(inject(IdbService), IDB_CONFIG.stores.tables);

  override getAll(): Promise<Table[]> {
    return this.store.getAll();
  }

  override getById(id: string): Promise<Table | undefined> {
    return this.store.getById(id);
  }

  override getByWorkspaceId(workspaceId: string): Promise<Table[]> {
    return this.store.getByIndex(IDB_CONFIG.indexes.workspaceId, workspaceId);
  }

  override getByCollectionId(collectionId: string): Promise<Table[]> {
    return this.store.getByIndex(IDB_CONFIG.indexes.collectionId, collectionId);
  }

  override save(table: Table): Promise<void> {
    return this.store.save(table);
  }

  override delete(id: string): Promise<void> {
    return this.store.delete(id);
  }
}
