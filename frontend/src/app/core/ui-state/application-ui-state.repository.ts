import { APPLICATION_UI_STATE_ID, ApplicationUiState } from './application-ui-state.model';
import { openDatabase, STORES } from '../persistence/database';
import { getById, transactionComplete } from '../persistence/indexed-db';

export async function getApplicationUiState(): Promise<ApplicationUiState | null> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readonly');

  const state = await getById<ApplicationUiState>(
    transaction.objectStore(STORES.application),
    APPLICATION_UI_STATE_ID,
  );
  return state ?? null;
}

export async function saveApplicationUiState(state: ApplicationUiState): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readwrite');
  transaction.objectStore(STORES.application).put(state);
  await transactionComplete(transaction);
}
