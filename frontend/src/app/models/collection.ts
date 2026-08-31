import { LifecycleState } from './common';

export interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  lifecycleState: LifecycleState;
}
