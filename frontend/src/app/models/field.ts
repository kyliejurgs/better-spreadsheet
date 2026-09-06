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
  | 'multi-select'
  | 'reference';

export type FieldValueModel = 'normal' | 'calculated' | 'generated';

export interface ReferenceConfig {
  tableId: string;
  cardinality: 'single' | 'multiple';
}

export interface Field {
  id: string;
  tableId: string;
  name: string;
  dataType: FieldDataType;
  valueModel: FieldValueModel;
  reference?: ReferenceConfig;
}
