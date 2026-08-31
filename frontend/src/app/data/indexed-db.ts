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
