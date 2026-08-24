export type LifecycleState = 'active' | 'archived';

export interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  lifecycleState: LifecycleState;
  createdAt: string;
  updatedAt: string;
}
