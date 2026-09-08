const DATABASE_NAME = 'better-spreadsheet';
const DATABASE_VERSION = 1;

export const STORES = {
  application: 'application',
  workspaces: 'workspaces',
  collections: 'collections',
  tables: 'tables',
  fields: 'fields',
  records: 'records',
  views: 'views',
  sections: 'sections',
} as const;

export const INDEXES = {
  workspaceId: 'workspaceId',
  tableId: 'tableId',
  viewId: 'viewId',
} as const;

// Reuse one open operation rather than creating a connection per request.
let databasePromise: Promise<IDBDatabase> | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  databasePromise ??= createDatabase();
  return databasePromise;
}

function createDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      createSchema(request.result);
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
  createStore(database, STORES.application);
  createStore(database, STORES.workspaces);
  createIndexedStore(database, STORES.collections, INDEXES.workspaceId);
  createIndexedStore(database, STORES.tables, INDEXES.workspaceId);
  createIndexedStore(database, STORES.fields, INDEXES.tableId);
  createIndexedStore(database, STORES.records, INDEXES.tableId);
  createIndexedStore(database, STORES.views, INDEXES.tableId);
  createIndexedStore(database, STORES.sections, INDEXES.viewId);
}

function createStore(database: IDBDatabase, name: string): IDBObjectStore | null {
  if (database.objectStoreNames.contains(name)) {
    return null;
  }

  return database.createObjectStore(name, { keyPath: 'id' });
}

function createIndexedStore(database: IDBDatabase, storeName: string, indexName: string): void {
  const store = createStore(database, storeName);
  if (store === null) {
    return;
  }

  // Ownership indexes are non-unique because parents may own many children.
  store.createIndex(indexName, indexName, { unique: false });
}
