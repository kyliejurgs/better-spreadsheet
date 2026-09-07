import { PersistedWorkAreaState } from '../models/work-area-state';
import { openDatabase, STORES } from './database';
import { getById, transactionComplete } from './indexed-db';

const WORK_AREA_STATE_PREFIX = 'work-area:';

export function getWorkAreaStateId(workspaceId: string): string {
  return `${WORK_AREA_STATE_PREFIX}${workspaceId}`;
}

export async function getWorkAreaState(
  workspaceId: string,
): Promise<PersistedWorkAreaState | null> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readonly');
  const state = await getById<PersistedWorkAreaState>(
    transaction.objectStore(STORES.application),
    getWorkAreaStateId(workspaceId),
  );
  return state ?? null;
}

export async function saveWorkAreaState(state: PersistedWorkAreaState): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readwrite');
  transaction.objectStore(STORES.application).put(state);
  await transactionComplete(transaction);
}
