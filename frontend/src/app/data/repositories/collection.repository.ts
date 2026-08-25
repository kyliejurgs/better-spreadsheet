import { Collection } from '../models/collection.model';

export abstract class CollectionRepository {
  abstract getAll(): Promise<Collection[]>;
  abstract getById(id: string): Promise<Collection | undefined>;
  abstract getByWorkspaceId(workspaceId: string): Promise<Collection[]>;
  abstract save(collection: Collection): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
