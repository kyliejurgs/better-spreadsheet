import { tuiCreateKeyStepsTransformer } from '@taiga-ui/core';

const DATABASE_NAME = 'better-spreadsheet';
const DATABASE_VERSION = 1;

export const STORES = {
  workspaces: 'workspaces',
  collections: 'collections',
  tables: 'tables',
  fields: 'fields',
  records: 'records',
  views: 'views',
  sections: 'sections',
} as const;

let databasePromise: Promise<IDBDatabase> | null = null;

export function openData(): Promise<IDBDatabase> {
  databasePromise ??= createDatabase();
  return databasePromise;
}

function createDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      resolve(request.result);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Unable to open Better Spreadsheet database.', { cause: request.error }));
    };
  });
}

function createSchema(database: IDBDatabase): void {
  createStore(database, STORES.workspaces);
  createStore(database, STORES.collections);
  createStore(database, STORES.tables);
  createStore(database, STORES.fields);
  createStore(database, STORES.records);
  createStore(database, STORES.records);
  createStore(database, STORES.views);
  createStore(database, STORES.sections);
}

function createStore(database: IDBDatabase, name: string): void {
  if (database.objectStoreNames.contains(name)) {
    return;
  }

  database.createObjectStore(name, { keyPath: 'id' });
}
