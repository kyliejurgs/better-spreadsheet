export type CellValue = unknown;

export interface RecordData {
  id: string;
  tableId: string;
  values: Record<string, CellValue>;
}
