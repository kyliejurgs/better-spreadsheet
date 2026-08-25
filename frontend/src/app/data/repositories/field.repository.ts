import { Field } from '../models/field.model';

export abstract class FieldRepository {
  abstract getAll(): Promise<Field[]>;
  abstract getById(id: string): Promise<Field | undefined>;
  abstract getByTableId(tableId: string): Promise<Field[]>;
  abstract save(field: Field): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
