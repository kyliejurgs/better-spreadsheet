export type WorkAreaResourceType = 'view' | 'query' | 'dashboard' | 'file';

export interface WorkAreaTab {
  resourceId: string;
  resourceType: WorkAreaResourceType;
  preview: boolean;
}

export interface WorkAreaState {
  openTabs: readonly WorkAreaTab[];
  activeTabId: string | null;
  activationHistory: readonly string[];
  lastViewByTable: Readonly<Record<string, string>>;
}

export interface PersistedWorkAreaState extends WorkAreaState {
  id: string;
  workspaceId: string;
}
