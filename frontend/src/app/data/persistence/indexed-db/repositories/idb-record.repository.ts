import { inject, Injectable } from '@angular/core';
import { RecordRepository } from '../../../repositories/record.repository';
import { IdbStore } from '../idb.store';
import { DataRecord } from '../../../models/record.model';
import { IdbService } from '../idb.service';
import { IDB_CONFIG } from '../idb.config';

@Injectable()
export class IdbRecordRepository extends RecordRepository {
  private readonly store = new IdbStore<DataRecord>(inject(IdbService), IDB_CONFIG.stores.records);

  override getAll(): Promise<DataRecord[]> {
    return this.store.getAll();
  }

  override getById(id: string): Promise<DataRecord | undefined> {
    return this.store.getById(id);
  }

  override getByTableId(tableId: string): Promise<DataRecord[]> {
    return this.store.getByIndex(IDB_CONFIG.indexes.tableId, tableId);
  }

  override save(record: DataRecord): Promise<void> {
    return this.store.save(record);
  }

  override delete(id: string): Promise<void> {
    return this.store.delete(id);
  }
}
