export type FieldDataType =
  | 'text'
  | 'number'
  | 'integer'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'single-select'
  | 'multi-select';

export type FieldValueModel = 'normal' | 'calculated' | 'generated';

export interface Field {
  id: string;
  tableId: string;
  name: string;
  dataType: FieldDataType;
  valueModel: FieldValueModel;
}
