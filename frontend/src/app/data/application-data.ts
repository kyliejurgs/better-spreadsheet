import { APPLICATION_METADATA_ID, ApplicationMetadata } from '../models/application-metadata';
import { openDatabase, STORES } from './database';
import { getById, transactionComplete } from './indexed-db';

/**
 * Loads durable application-level state. Missing metadata indicates that this browser has never
 * completed first-run initialization.
 */
export async function getApplicationMetadata(): Promise<ApplicationMetadata | null> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readonly');

  const metadata = await getById<ApplicationMetadata>(
    transaction.objectStore(STORES.application),
    APPLICATION_METADATA_ID,
  );
  return metadata ?? null;
}

export async function saveApplicationMetadata(metadata: ApplicationMetadata): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORES.application, 'readwrite');
  transaction.objectStore(STORES.application).put(metadata);
  await transactionComplete(transaction);
}
