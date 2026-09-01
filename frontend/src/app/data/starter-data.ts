import { Collection } from '../models/collection';
import { Field } from '../models/field';
import { RecordData } from '../models/record';
import { Section } from '../models/section';
import { Table } from '../models/table';
import { View } from '../models/view';
import { Workspace } from '../models/workspace';
import { ApplicationData } from './workspace-data';

/**
 * Loads starter dataset bundled with Better Spreadsheet. Only application code that knows starter
 * data exists. Once imported, starter objects are ordinary persisted application data.
 */
export async function loadStarterData(): Promise<ApplicationData> {
  const [workspaces, collections, tables, fields, records, views, sections] = await Promise.all([
    loadJson<Workspace>('workspaces.json'),
    loadJson<Collection>('collections.json'),
    loadJson<Table>('tables.json'),
    loadJson<Field>('fields.json'),
    loadJson<RecordData>('records.json'),
    loadJson<View>('views.json'),
    loadJson<Section>('sections.json'),
  ]);

  return {
    workspaces,
    collections,
    tables,
    fields,
    records,
    views,
    sections,
  };
}

/**
 * Verifies minimum persistence identity contract before bundled JSON enters IndexedDB. Full
 * per-model validation can replace this boundary as the domain validation layer is implemented.
 */
async function loadJson<T extends { id: string }>(filename: string): Promise<T[]> {
  const url = new URL(`starter-data/${filename}`, document.baseURI);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load starter data ${filename}: ` + `${response.status}.`);
  }

  const value: unknown = await response.json();
  assertIdentifiedObjectArray(value, filename);
  return value as T[];
}

function assertIdentifiedObjectArray(
  value: unknown,
  filename: string,
): asserts value is Array<Record<string, unknown> & { id: string }> {
  if (!Array.isArray(value) || value.some((item) => !hasStringId(item))) {
    throw new Error(`Starter data ${filename} must contain objects with string IDs.`);
  }
}

function hasStringId(value: unknown): value is Record<string, unknown> & { id: string } {
  return (
    typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string'
  );
}
