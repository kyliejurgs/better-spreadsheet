export type SectionType = 'manual' | 'generated';

export interface SectionGrouping {
  fieldId: string;
  value: unknown;
}

export interface Section {
  id: string;
  viewId: string;
  parentSectionId: string | null;
  name: string;
  type: SectionType;
  order: number;
  grouping?: SectionGrouping;
}
