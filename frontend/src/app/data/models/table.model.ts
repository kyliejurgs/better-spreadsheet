import { LifecycleState } from './collection.model';

export interface Table {
  id: string;
  workspaceId: string;
  collectionId: string | null;
  name: string;
  lifecycleState: LifecycleState;
  createdAt: string;
  updatedAt: string;
}
