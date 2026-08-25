import { inject, Injectable } from '@angular/core';
import { IdbStore } from './idb.store';
import { IdbMetadata } from './idb.model';
import { IdbService } from './idb.service';
import { IDB_CONFIG } from './idb.config';

@Injectable({
  providedIn: 'root',
})
export class IdbMetadataService {
  private readonly store = new IdbStore<IdbMetadata>(
    inject(IdbService),
    IDB_CONFIG.stores.metadata,
  );

  async get<T>(key: string): Promise<T | undefined> {
    const metadata = await this.store.getById(key);
    return metadata?.value as T | undefined;
  }

  set(key: string, value: unknown): Promise<void> {
    return this.store.save({ key, value });
  }

  delete(key: string): Promise<void> {
    return this.store.delete(key);
  }
}
