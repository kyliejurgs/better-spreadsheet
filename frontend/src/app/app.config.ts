import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { WorkspaceRepository } from './data/repositories/workspace.repository';
import { IdbWorkspaceRepository } from './data/persistence/indexed-db/repositories/idb-workspace.repository';
import { CollectionRepository } from './data/repositories/collection.repository';
import { IdbCollectionRepository } from './data/persistence/indexed-db/repositories/idb-collection.repository';
import { TableRepository } from './data/repositories/table.repository';
import { IdbTableRepository } from './data/persistence/indexed-db/repositories/idb-table.repository';
import { FieldRepository } from './data/repositories/field.repository';
import { IdbFieldRepository } from './data/persistence/indexed-db/repositories/idb-field.repository';
import { RecordRepository } from './data/repositories/record.repository';
import { IdbRecordRepository } from './data/persistence/indexed-db/repositories/idb-record.repository';
import { SeedService } from './data/seed/seed.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: WorkspaceRepository, useClass: IdbWorkspaceRepository },
    { provide: CollectionRepository, useClass: IdbCollectionRepository },
    { provide: TableRepository, useClass: IdbTableRepository },
    { provide: FieldRepository, useClass: IdbFieldRepository },
    { provide: RecordRepository, useClass: IdbRecordRepository },

    provideAppInitializer(() => {
      return inject(SeedService).initialize();
    }),
  ],
};
