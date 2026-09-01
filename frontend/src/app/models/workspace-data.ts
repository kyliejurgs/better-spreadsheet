import { Collection } from './collection';
import { Field } from './field';
import { RecordData } from './record';
import { Section } from './section';
import { Table } from './table';
import { View } from './view';
import { Workspace } from './workspace';

export interface WorkspaceData {
  workspace: Workspace;
  collections: Collection[];
  tables: Table[];
  fields: Field[];
  records: RecordData[];
  views: View[];
  sections: Section[];
}
