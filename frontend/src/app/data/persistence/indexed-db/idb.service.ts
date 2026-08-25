import { Injectable } from '@angular/core';
import { IDB_CONFIG } from './idb.config';

@Injectable({
  providedIn: 'root',
})
export class IdbService {
  private databasePromise: Promise<IDBDatabase> | undefined;

  getDatabase(): Promise<IDBDatabase> {
    this.databasePromise ??= this.openDatabase();
    return this.databasePromise;
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.version);

      request.onupgradeneeded = () => {
        this.createSchema(request.result);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private createSchema(database: IDBDatabase): void {
    const { stores } = IDB_CONFIG;
    if (!database.objectStoreNames.contains(stores.workspaces)) {
      database.createObjectStore(stores.workspaces, { keyPath: 'id' });
    }

    if (!database.objectStoreNames.contains(stores.collections)) {
      const store = database.createObjectStore(stores.collections, { keyPath: 'id' });
      store.createIndex(IDB_CONFIG.indexes.workspaceId, 'workspaceId', { unique: false });
    }

    if (!database.objectStoreNames.contains(stores.tables)) {
      const store = database.createObjectStore(stores.tables, { keyPath: 'id' });
      store.createIndex(IDB_CONFIG.indexes.workspaceId, 'workspaceId', { unique: false });
      store.createIndex(IDB_CONFIG.indexes.collectionId, 'collectionId', { unique: false });
    }
    if (!database.objectStoreNames.contains(stores.fields)) {
      const store = database.createObjectStore(stores.fields, { keyPath: 'id' });
      store.createIndex(IDB_CONFIG.indexes.tableId, 'tableId', { unique: false });
    }

    if (!database.objectStoreNames.contains(stores.records)) {
      const store = database.createObjectStore(stores.records, { keyPath: 'id' });
      store.createIndex(IDB_CONFIG.indexes.tableId, 'tableId', { unique: false });
    }

    if (!database.objectStoreNames.contains(stores.metadata)) {
      database.createObjectStore(stores.metadata, { keyPath: 'key' });
    }
  }
}
