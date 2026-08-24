import { Table } from '../models/table.model';

export abstract class TableRepository {
  abstract getAll(): Promise<Table[]>;
  abstract getById(id: string): Promise<Table | undefined>;
  abstract getByWorkspaceId(workspaceId: string): Promise<Table[]>;
  abstract getByCollectionId(collectionId: string): Promise<Table[]>;
  abstract save(table: Table): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
