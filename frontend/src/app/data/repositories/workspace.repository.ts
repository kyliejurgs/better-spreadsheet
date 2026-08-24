import { Workspace } from '../models/workspace.model';

export abstract class WorkspaceRepository {
  abstract getAll(): Promise<Workspace[]>;
  abstract getById(): Promise<Workspace | undefined>;
  abstract save(workspace: Workspace): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
