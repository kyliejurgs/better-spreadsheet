export type RecordValue = boolean | number | string | string[] | null;

export interface DataRecord {
  id: string;
  tableId: string;
  values: Record<string, RecordValue>;
}
