import { inject, Injectable } from '@angular/core';
import { FieldRepository } from '../../../repositories/field.repository';
import { IdbStore } from '../idb.store';
import { Field } from '../../../models/field.model';
import { IdbService } from '../idb.service';
import { IDB_CONFIG } from '../idb.config';

@Injectable()
export class IdbFieldRepository extends FieldRepository {
  private readonly store = new IdbStore<Field>(inject(IdbService), IDB_CONFIG.stores.fields);

  override getAll(): Promise<Field[]> {
    return this.store.getAll();
  }

  override getById(id: string): Promise<Field | undefined> {
    return this.store.getById(id);
  }

  override getByTableId(tableId: string): Promise<Field[]> {
    return this.store.getByIndex(IDB_CONFIG.indexes.tableId, tableId);
  }

  override save(field: Field): Promise<void> {
    return this.store.save(field);
  }

  override delete(id: string): Promise<void> {
    return this.store.delete(id);
  }
}
