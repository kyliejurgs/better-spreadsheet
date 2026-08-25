import { DataRecord } from '../models/record.model';

export abstract class RecordRepository {
  abstract getAll(): Promise<DataRecord[]>;
  abstract getById(id: string): Promise<DataRecord | undefined>;
  abstract getByTableId(tableId: string): Promise<DataRecord[]>;
  abstract save(record: DataRecord): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
