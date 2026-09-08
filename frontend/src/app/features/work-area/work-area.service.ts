import { computed, Injectable, resource, signal } from '@angular/core';
import { PersistedWorkAreaState, WorkAreaState, WorkAreaTab } from './work-area-state.model';
import {
  getWorkAreaState,
  getWorkAreaStateId,
  saveWorkAreaState,
} from './work-area-state.repository';

const EMPTY_WORK_AREA_STATE: WorkAreaState = {
  openTabs: [],
  activeTabId: null,
  activationHistory: [],
  lastViewByTable: {},
};

@Injectable({ providedIn: 'root' })
export class WorkAreaService {
  private readonly state = signal<WorkAreaState>(EMPTY_WORK_AREA_STATE);

  private workspaceId: string | null = null;

  readonly openTabs = computed(() => this.state().openTabs);
  readonly activeTabId = computed(() => this.state().activeTabId);

  readonly activeTab = computed<WorkAreaTab | null>(() => {
    const activeTabId = this.state().activeTabId;
    if (activeTabId === null) {
      return null;
    }
    return this.state().openTabs.find((tab) => tab.resourceId === activeTabId) ?? null;
  });

  async loadWorkspace(workspaceId: string): Promise<void> {
    const persistedState = await getWorkAreaState(workspaceId);
    this.workspaceId = workspaceId;
    this.state.set(
      persistedState === null
        ? EMPTY_WORK_AREA_STATE
        : {
            openTabs: persistedState.openTabs,
            activeTabId: persistedState.activeTabId,
            activationHistory: persistedState.activationHistory,
            lastViewByTable: persistedState.lastViewByTable ?? {},
          },
    );
  }

  clearWorkspace(): void {
    this.workspaceId = null;
    this.state.set(EMPTY_WORK_AREA_STATE);
  }

  openPreview(tab: Omit<WorkAreaTab, 'preview'>): void {
    const state = this.state();
    const existingTab = state.openTabs.find(
      (openTab) =>
        openTab.resourceId === tab.resourceId && openTab.resourceType === tab.resourceType,
    );

    if (existingTab !== undefined) {
      this.activateTab(existingTab.resourceId);
      return;
    }

    const previewIndex = state.openTabs.findIndex((openTab) => openTab.preview);
    const previewTab: WorkAreaTab = { ...tab, preview: true };

    let openTabs: WorkAreaTab[];

    if (previewIndex >= 0) {
      openTabs = [...state.openTabs];
      openTabs.splice(previewIndex, 1, previewTab);
    } else {
      openTabs = [...state.openTabs];
      const activeIndex =
        state.activeTabId === null
          ? -1
          : openTabs.findIndex((openTab) => openTab.resourceId === state.activeTabId);
      const insertIndex = activeIndex >= 0 ? activeIndex + 1 : openTabs.length;

      openTabs.splice(insertIndex, 0, previewTab);
    }

    const validActivationHistory = state.activationHistory.filter((resourceId) =>
      openTabs.some((openTab) => openTab.resourceId === resourceId),
    );

    this.setState({
      ...state,
      openTabs,
      activeTabId: tab.resourceId,
      activationHistory: this.recordActivation(validActivationHistory, tab.resourceId),
    });
  }

  openPermanent(tab: Omit<WorkAreaTab, 'preview'>): void {
    const state = this.state();
    const existingIndex = state.openTabs.findIndex(
      (openTab) =>
        openTab.resourceId === tab.resourceId && openTab.resourceType === tab.resourceType,
    );

    if (existingIndex >= 0) {
      const existingTab = state.openTabs[existingIndex];
      if (existingTab?.preview) {
        const openTabs = [...state.openTabs];
        openTabs[existingIndex] = { ...existingTab, preview: false };
        this.setState({
          ...state,
          openTabs,
          activeTabId: tab.resourceId,
          activationHistory: this.recordActivation(state.activationHistory, tab.resourceId),
        });
        return;
      }

      this.activateTab(tab.resourceId);
      return;
    }

    const openTabs = [...state.openTabs];
    const activeIndex =
      state.activeTabId === null
        ? -1
        : openTabs.findIndex((openTab) => openTab.resourceId === state.activeTabId);
    const insertIndex = activeIndex >= 0 ? activeIndex + 1 : openTabs.length;

    openTabs.splice(insertIndex, 0, { ...tab, preview: false });
    this.setState({
      ...state,
      openTabs,
      activeTabId: tab.resourceId,
      activationHistory: this.recordActivation(state.activationHistory, tab.resourceId),
    });
  }

  activateTab(resourceId: string): void {
    const state = this.state();
    if (!state.openTabs.some((tab) => tab.resourceId === resourceId)) {
      return;
    }
    this.setState({
      ...state,
      activeTabId: resourceId,
      activationHistory: this.recordActivation(state.activationHistory, resourceId),
    });
  }

  closeTab(resourceId: string): void {
    const state = this.state();
    const closingIndex = state.openTabs.findIndex((tab) => tab.resourceId === resourceId);
    if (closingIndex < 0) {
      return;
    }

    const openTabs = state.openTabs.filter((tab) => tab.resourceId !== resourceId);
    const activationHistory = state.activationHistory.filter((id) => id !== resourceId);
    const activeTabId =
      state.activeTabId === resourceId
        ? this.resolveNextActiveTab(openTabs, activationHistory, closingIndex)
        : state.activeTabId;

    this.setState({ ...state, openTabs, activeTabId, activationHistory });
  }

  closeOtherTabs(resourceId: string): void {
    const state = this.state();
    const tab = state.openTabs.find((openTab) => openTab.resourceId === resourceId);
    if (tab === undefined) {
      return;
    }

    this.setState({
      ...state,
      openTabs: [tab],
      activeTabId: resourceId,
      activationHistory: [resourceId],
    });
  }

  closeAllTabs(): void {
    this.setState({ ...EMPTY_WORK_AREA_STATE, lastViewByTable: this.state().lastViewByTable });
  }

  reorderTab(resourceId: string, targetIndex: number): void {
    const state = this.state();
    const currentIndex = state.openTabs.findIndex((tab) => tab.resourceId === resourceId);
    if (currentIndex < 0) {
      return;
    }

    const openTabs = [...state.openTabs];
    const [tab] = openTabs.splice(currentIndex, 1);
    if (tab === undefined) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(targetIndex, openTabs.length));
    openTabs.splice(boundedIndex, 0, tab);
    this.setState({ ...state, openTabs });
  }

  lastViewedView(tableId: string): string | null {
    return this.state().lastViewByTable[tableId] ?? null;
  }

  recordViewedView(tableId: string, viewId: string): void {
    const state = this.state();
    if (state.lastViewByTable[tableId] === viewId) {
      return;
    }

    this.setState({
      ...state,
      lastViewByTable: { ...state.lastViewByTable, [tableId]: viewId },
    });
  }

  private setState(state: WorkAreaState): void {
    this.state.set(state);
    void this.persistState(state);
  }

  private async persistState(state: WorkAreaState): Promise<void> {
    if (this.workspaceId === null) {
      return;
    }

    const persistedState: PersistedWorkAreaState = {
      id: getWorkAreaStateId(this.workspaceId),
      workspaceId: this.workspaceId,
      openTabs: state.openTabs,
      activeTabId: state.activeTabId,
      activationHistory: state.activationHistory,
      lastViewByTable: state.lastViewByTable,
    };

    await saveWorkAreaState(persistedState);
  }

  private recordActivation(history: readonly string[], resourceId: string): readonly string[] {
    return [...history.filter((id) => id !== resourceId), resourceId];
  }

  private resolveNextActiveTab(
    openTabs: readonly WorkAreaTab[],
    activationHistory: readonly string[],
    closingIndex: number,
  ): string | null {
    if (openTabs.length === 0) {
      return null;
    }

    for (let index = activationHistory.length - 1; index >= 0; index--) {
      const resourceId = activationHistory[index];
      if (resourceId !== undefined && openTabs.some((tab) => tab.resourceId === resourceId)) {
        return resourceId;
      }
    }
    return openTabs[closingIndex]?.resourceId ?? openTabs[closingIndex - 1]?.resourceId ?? null;
  }
}
