import { IdbService } from './idb.service';
import { requestToPromise, transactionToPromise } from './idb.utils';

export class IdbStore<T> {
  constructor(
    private readonly idbService: IdbService,
    private readonly storeName: string,
  ) {}

  async getAll(): Promise<T[]> {
    const store = await this.getStore();
    return requestToPromise(store.getAll());
  }

  async getById(id: string): Promise<T | undefined> {
    const store = await this.getStore();
    return requestToPromise(store.get(id));
  }

  async getByIndex(indexName: string, value: string): Promise<T[]> {
    const store = await this.getStore();
    const index = store.index(indexName);
    return requestToPromise(index.getAll(value));
  }

  async save(value: T): Promise<void> {
    const database = await this.idbService.getDatabase();
    const transaction = database.transaction(this.storeName, 'readwrite');
    transaction.objectStore(this.storeName).put(value);
    return transactionToPromise(transaction);
  }

  async delete(id: string): Promise<void> {
    const database = await this.idbService.getDatabase();
    const transaction = database.transaction(this.storeName, 'readwrite');
    transaction.objectStore(this.storeName).delete(id);
    return transactionToPromise(transaction);
  }

  private async getStore(): Promise<IDBObjectStore> {
    const database = await this.idbService.getDatabase();
    const transaction = database.transaction(this.storeName, 'readonly');
    return transaction.objectStore(this.storeName);
  }
}
