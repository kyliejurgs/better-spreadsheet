export const APPLICATION_UI_STATE_ID = 'ui-state';

export type LeftPanelView = 'explorer' | 'search';
export type ExplorerSectionId = 'workspace' | 'files';

export interface ApplicationUiState {
  id: typeof APPLICATION_UI_STATE_ID;
  layout: ApplicationLayoutState;
  explorer: ExplorerState;
}

export interface ApplicationLayoutState {
  leftPanelPreferredWidth: number;
  rightPanelPreferredWidth: number;
  bottomPanelPreferredHeight: number;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  bottomPanelCollapsed: boolean;
  activeLeftPanelView: LeftPanelView;
}

export interface ExplorerState {
  sectionWeights: Readonly<Record<ExplorerSectionId, number>>;
  expandedExplorerSections: ReadonlySet<ExplorerSectionId>;
  expandedCollections: Readonly<Record<string, readonly string[]>>;
  expandedTables: Readonly<Record<string, readonly string[]>>;
}
