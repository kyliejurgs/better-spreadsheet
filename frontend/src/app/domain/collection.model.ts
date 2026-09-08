import { LifecycleState } from './common.model';

export interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  lifecycleState: LifecycleState;
}
