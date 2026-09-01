/** Converts IndexedDB request into a Promise while preserving original IndexedDB error */
export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('IndexedDB request failed.', { cause: request.error }));
    };
  });
}

export function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(new Error('IndexedDB transaction failed.', { cause: transaction.error }));
    };

    transaction.onabort = () => {
      reject(new Error('IndexedDB transaction was aborted', { cause: transaction.error }));
    };
  });
}

export function getAll<T>(store: IDBObjectStore): Promise<T[]> {
  return requestResult(store.getAll() as IDBRequest<T[]>);
}

export function getById<T>(store: IDBObjectStore, id: string): Promise<T | undefined> {
  return requestResult(store.get(id) as IDBRequest<T | undefined>);
}
