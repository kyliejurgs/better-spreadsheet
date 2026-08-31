import { LifecycleState } from './common';

export interface Table {
  id: string;
  workspaceId: string;
  collectionId: string | null;
  name: string;
  lifecycleState: LifecycleState;
}
