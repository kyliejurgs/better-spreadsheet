import { Collection } from '../../domain/collection.model';
import { Field } from '../../domain/field.model';
import { RecordData } from '../../domain/record.model';
import { Section } from '../../domain/section.model';
import { Table } from '../../domain/table.model';
import { View } from '../../domain/view.model';
import { Workspace } from './workspace.model';

export interface WorkspaceData {
  workspace: Workspace;
  collections: Collection[];
  tables: Table[];
  fields: Field[];
  records: RecordData[];
  views: View[];
  sections: Section[];
}
