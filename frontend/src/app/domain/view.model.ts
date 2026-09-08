import { LifecycleState } from './common.model';

export interface View {
  id: string;
  tableId: string;
  name: string;
  lifecycleState: LifecycleState;
  required: boolean;
}
