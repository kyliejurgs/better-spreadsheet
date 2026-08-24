export type FieldDataType =
  | 'attachment'
  | 'boolean'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'integer'
  | 'multi-select'
  | 'number'
  | 'percentage'
  | 'rating'
  | 'reference'
  | 'single-select'
  | 'text'
  | 'time';

export type FieldValueModel = 'calculated' | 'generated' | 'normal';

export interface FieldValidation {
  required: boolean;
  minItems?: number;
  maxItems?: number;
}

export interface FieldOption {
  id: string;
  label: string;
}

export type FieldGeneratorType = 'created' | 'modified' | 'sequence' | 'uuid';

export interface FieldGenerator {
  type: FieldGeneratorType;
  start?: number;
  increment?: number;
  prefix?: string;
  padding?: number;
}

export interface FieldReference {
  tableId: string;
  multiple: boolean;
}

export interface Field {
  id: string;
  tableId: string;
  name: string;
  dataType: FieldDataType;
  valueModel: FieldValueModel;
  validation: FieldValidation;
  options?: FieldOption[];
  currency?: string;
  generator?: FieldGenerator;
  reference?: FieldReference;
}
