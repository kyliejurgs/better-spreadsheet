import { inject, Injectable } from '@angular/core';
import { CollectionRepository } from '../repositories/collection.repository';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { TableRepository } from '../repositories/table.repository';
import { FieldRepository } from '../repositories/field.repository';
import { RecordRepository } from '../repositories/record.repository';
import { IdbMetadataService } from '../persistence/indexed-db/idb-metadata.service';
import { SEED_CONFIG } from './seed.config';
import { Workspace } from '../models/workspace.model';
import { Collection } from '../models/collection.model';
import { Table } from '../models/table.model';
import { Field } from '../models/field.model';
import { DataRecord } from '../models/record.model';

@Injectable({
  providedIn: 'root',
})
export class SeedService {
  private readonly workspaceRepo = inject(WorkspaceRepository);
  private readonly collectionRepo = inject(CollectionRepository);
  private readonly tableRepo = inject(TableRepository);
  private readonly fieldRepo = inject(FieldRepository);
  private readonly recordRepo = inject(RecordRepository);
  private readonly metadataService = inject(IdbMetadataService);

  async initialize(): Promise<void> {
    const initialized = await this.metadataService.get<boolean>(SEED_CONFIG.metadataKey);
    if (initialized) {
      return;
    }

    const [workspaces, collections, tables, fields, records] = await Promise.all([
      this.load<Workspace[]>(SEED_CONFIG.assets.workspaces),
      this.load<Collection[]>(SEED_CONFIG.assets.collections),
      this.load<Table[]>(SEED_CONFIG.assets.tables),
      this.load<Field[]>(SEED_CONFIG.assets.fields),
      this.load<DataRecord[]>(SEED_CONFIG.assets.records),
    ]);

    await this.saveAll(this.workspaceRepo, workspaces);
    await this.saveAll(this.collectionRepo, collections);
    await this.saveAll(this.tableRepo, tables);
    await this.saveAll(this.fieldRepo, fields);
    await this.saveAll(this.recordRepo, records);

    await this.metadataService.set(SEED_CONFIG.metadataKey, true);
  }

  private async load<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load seed data: ${path}`);
    }
    return response.json() as Promise<T>;
  }

  private async saveAll<T>(
    repository: { save(value: T): Promise<void> },
    values: T[],
  ): Promise<void> {
    await Promise.all(values.map((value) => repository.save(value)));
  }
}
