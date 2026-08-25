export const SEED_CONFIG = {
  metadataKey: 'seedInitialized',

  assets: {
    collections: 'seed/collections.json',
    fields: 'seed/fields.json',
    records: 'seed/records.json',
    tables: 'seed/tables.json',
    workspaces: 'seed/workspaces.json',
  },
} as const;
