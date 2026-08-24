import { LifecycleState } from './shared.model';

export interface Table {
  id: string;
  workspaceId: string;
  collectionId: string | null;
  name: string;
  lifecycleState: LifecycleState;
  createdAt: string;
  updatedAt: string;
}
