import { Collection } from '../models/collection';
import { Field } from '../models/field';
import { RecordData } from '../models/record';
import { Section } from '../models/section';
import { Table } from '../models/table';
import { View } from '../models/view';
import { Workspace } from '../models/workspace';
import { WorkspaceData } from '../models/workspace-data';
import { INDEXES, openDatabase, STORES } from './database';
import { getAll, getById, requestResult } from './indexed-db';

export async function getWorkspaces(): Promise<Workspace[]> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.workspaces, 'readonly');
  return getAll<Workspace>(transaction.objectStore(STORES.workspaces));
}

export async function getWorkspaceData(workspaceId: string): Promise<WorkspaceData | null> {
  const database = await openDatabase();
  const transaction = database.transaction(Object.values(STORES), 'readonly');
  const workspaceStore = transaction.objectStore(STORES.workspaces);
  const workspace = await getById<Workspace>(workspaceStore, workspaceId);

  if (workspace === undefined) {
    return null;
  }

  const collections = await getByIndex<Collection>(
    transaction.objectStore(STORES.collections),
    INDEXES.workspaceId,
    workspaceId,
  );

  const tables = await getByIndex<Table>(
    transaction.objectStore(STORES.tables),
    INDEXES.workspaceId,
    workspaceId,
  );

  // Fields, records, views are assigned a table ID so load through that
  const tableIds = tables.map((table) => table.id);
  const [fields, records, views] = await Promise.all([
    getForKeys<Field>(transaction.objectStore(STORES.fields), INDEXES.tableId, tableIds),
    getForKeys<RecordData>(transaction.objectStore(STORES.records), INDEXES.tableId, tableIds),
    getForKeys<View>(transaction.objectStore(STORES.views), INDEXES.tableId, tableIds),
  ]);

  // Sections are assigned a view ID so load through that
  const viewIds = views.map((view) => view.id);
  const sections = await getForKeys<Section>(
    transaction.objectStore(STORES.sections),
    INDEXES.viewId,
    viewIds,
  );

  return { workspace, collections, tables, fields, records, views, sections };
}

// Reads all objects whose indexed owner matches the supplied key.
async function getByIndex<T>(store: IDBObjectStore, indexName: string, key: string): Promise<T[]> {
  const index = store.index(indexName);
  return requestResult(index.getAll(key) as IDBRequest<T[]>);
}

// Resolves children for multiple parent IDs and flattens into one collection
async function getForKeys<T>(
  store: IDBObjectStore,
  indexName: string,
  keys: readonly string[],
): Promise<T[]> {
  const results = await Promise.all(
    keys.map((key) => {
      return getByIndex<T>(store, indexName, key);
    }),
  );
  return results.flat();
}
