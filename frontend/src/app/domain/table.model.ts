import { LifecycleState } from './common.model';

export interface Table {
  id: string;
  workspaceId: string;
  collectionId: string | null;
  name: string;
  lifecycleState: LifecycleState;
}
