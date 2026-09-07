export type WorkAreaResourceType = 'view' | 'query' | 'dashboard' | 'file';

export interface WorkAreaTab {
  resourceId: string;
  resourceType: WorkAreaResourceType;
}

export interface WorkAreaState {
  openTabs: readonly WorkAreaTab[];
  activeTabId: string | null;
  activationHistory: readonly string[];
}
