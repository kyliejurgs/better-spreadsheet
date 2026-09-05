import { Injectable, signal } from '@angular/core';
import { APPLICATION_LAYOUT } from '../layout/application-layout/application-layout.config';
import {
  APPLICATION_UI_STATE_ID,
  ApplicationUiState,
  ExplorerSectionId,
  LeftPanelView,
} from '../models/application-ui-state';
import { getApplicationUiState, saveApplicationUiState } from '../data/application-ui-state-data';

@Injectable({ providedIn: 'root' })
export class ApplicationUiStateService {
  readonly leftPanelPreferredWidth = signal<number>(APPLICATION_LAYOUT.leftPanel.defaultWidth);
  readonly rightPanelPreferredWidth = signal<number>(APPLICATION_LAYOUT.rightPanel.defaultWidth);
  readonly bottomPanelPreferredHeight = signal<number>(
    APPLICATION_LAYOUT.bottomPanel.defaultHeight,
  );

  readonly leftPanelCollapsed = signal(false);
  readonly rightPanelCollapsed = signal(false);
  readonly bottomPanelCollapsed = signal(false);

  readonly activeLeftPanelView = signal<LeftPanelView>('explorer');

  readonly sectionWeights = signal<Record<ExplorerSectionId, number>>({
    workspace: 1,
    files: 1,
  });

  readonly expandedExplorerSections = signal<ReadonlySet<ExplorerSectionId>>(
    new Set(['workspace']),
  );
  readonly expandedCollections = signal<Readonly<Record<string, readonly string[]>>>({});
  readonly expandedTables = signal<Readonly<Record<string, readonly string[]>>>({});

  async initialize(): Promise<void> {
    const state = await getApplicationUiState();
    if (state === null) {
      return;
    }

    this.leftPanelPreferredWidth.set(state.layout.leftPanelPreferredWidth);
    this.rightPanelPreferredWidth.set(state.layout.rightPanelPreferredWidth);
    this.bottomPanelPreferredHeight.set(state.layout.bottomPanelPreferredHeight);

    this.leftPanelCollapsed.set(state.layout.leftPanelCollapsed);
    this.rightPanelCollapsed.set(state.layout.rightPanelCollapsed);
    this.bottomPanelCollapsed.set(state.layout.bottomPanelCollapsed);

    this.activeLeftPanelView.set(state.layout.activeLeftPanelView);

    this.sectionWeights.set(state.explorer.sectionWeights);
    this.expandedExplorerSections.set(state.explorer.expandedExplorerSections);
    this.expandedCollections.set(state.explorer.expandedCollections);
    this.expandedTables.set(state.explorer.expandedTables);
  }

  async save(): Promise<void> {
    await saveApplicationUiState(this.createPersistedState());
  }

  private createPersistedState(): ApplicationUiState {
    return {
      id: APPLICATION_UI_STATE_ID,
      layout: {
        leftPanelPreferredWidth: this.leftPanelPreferredWidth(),
        rightPanelPreferredWidth: this.rightPanelPreferredWidth(),
        bottomPanelPreferredHeight: this.bottomPanelPreferredHeight(),
        leftPanelCollapsed: this.leftPanelCollapsed(),
        rightPanelCollapsed: this.rightPanelCollapsed(),
        bottomPanelCollapsed: this.bottomPanelCollapsed(),
        activeLeftPanelView: this.activeLeftPanelView(),
      },
      explorer: {
        sectionWeights: this.sectionWeights(),
        expandedExplorerSections: { ...this.expandedExplorerSections() },
        expandedCollections: this.expandedCollections(),
        expandedTables: this.expandedTables(),
      },
    };
  }
}
