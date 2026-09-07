import { computed, Injectable, signal } from '@angular/core';
import { WorkAreaState, WorkAreaTab } from '../models/work-area-state';

const EMPTY_WORK_AREA_STATE: WorkAreaState = {
  openTabs: [],
  activeTabId: null,
  activationHistory: [],
};

@Injectable({ providedIn: 'root' })
export class WorkAreaService {
  private readonly state = signal<WorkAreaState>(EMPTY_WORK_AREA_STATE);

  readonly openTabs = computed(() => this.state().openTabs);
  readonly activeTabId = computed(() => this.state().activeTabId);

  readonly activeTab = computed<WorkAreaTab | null>(() => {
    const activeTabId = this.state().activeTabId;
    if (activeTabId === null) {
      return null;
    }
    return this.state().openTabs.find((tab) => tab.resourceId === activeTabId) ?? null;
  });

  openTab(tab: WorkAreaTab): void {
    const state = this.state();
    const existingTab = state.openTabs.find(
      (openTab) =>
        openTab.resourceId === tab.resourceId && openTab.resourceType === tab.resourceType,
    );

    if (existingTab !== undefined) {
      this.activateTab(existingTab.resourceId);
      return;
    }

    const openTabs = [...state.openTabs];
    const activeIndex =
      state.activeTabId === null
        ? -1
        : openTabs.findIndex((openTab) => openTab.resourceId === state.activeTabId);
    const insertionIndex = activeIndex >= 0 ? activeIndex + 1 : openTabs.length;

    openTabs.splice(insertionIndex, 0, tab);
    this.state.set({
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
    this.state.set({
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

    this.state.set({
      openTabs,
      activeTabId,
      activationHistory,
    });
  }

  closeOtherTabs(resourceId: string): void {
    const tab = this.state().openTabs.find((openTab) => openTab.resourceId === resourceId);
    if (tab === undefined) {
      return;
    }

    this.state.set({
      openTabs: [tab],
      activeTabId: resourceId,
      activationHistory: [resourceId],
    });
  }

  closeAllTabs(): void {
    this.state.set(EMPTY_WORK_AREA_STATE);
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
    this.state.set({ ...state, openTabs });
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
