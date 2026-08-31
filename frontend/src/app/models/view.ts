import { LifecycleState } from './common';

export interface View {
  id: string;
  tableId: string;
  name: string;
  lifecycleState: LifecycleState;
  required: boolean;
}
