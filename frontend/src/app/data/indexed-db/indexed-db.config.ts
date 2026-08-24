export const INDEXED_DB_CONFIG = {
  name: 'better-spreadsheet',
  version: 1,

  stores: {
    collections: 'collections',
    fields: 'fields',
    metadata: 'metadata',
    records: 'records',
    tables: 'tables',
    workspaces: 'workspaces',
  },

  indexes: {
    workspaceId: 'workspaceId',
    collectionId: 'collectionId',
    tableId: 'tableId',
  },
} as const;
