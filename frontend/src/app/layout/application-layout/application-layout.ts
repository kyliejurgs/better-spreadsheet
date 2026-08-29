import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { LogoArea } from '../logo-area/logo-area';
import { Header } from '../header/header';
import { ActivityBar } from '../activity-bar/activity-bar';
import { LeftPanel } from '../left-panel/left-panel';
import { CenterArea } from '../center-area/center-area';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';
import { APPLICATION_LAYOUT } from './application-layout.config';
import { ContainerSize } from '../../shared/resizable-container/resizable-container';
import { ResizablePanel } from '../resizable-panel/resizable-panel';

type SidePanel = 'left' | 'right';

interface SidePanelState {
  minWidth: number;
  preferredWidth: WritableSignal<number>;
  actualWidth: WritableSignal<number>;
  collapsed: WritableSignal<boolean>;
  constraintCollapsed: WritableSignal<boolean>;
  visible: Signal<boolean>;
}

@Component({
  imports: [
    LogoArea,
    Header,
    ActivityBar,
    LeftPanel,
    CenterArea,
    RightPanel,
    StatusBar,
    ResizablePanel,
  ],
  selector: 'app-application-layout',
  styleUrl: './application-layout.css',
  templateUrl: './application-layout.html',
})
export class ApplicationLayout implements AfterViewInit, OnDestroy {
  protected readonly config = APPLICATION_LAYOUT;
  private readonly mainWorkspace = viewChild.required<ElementRef<HTMLElement>>('mainWorkspace');
  private readonly workspaceWidth = signal(0);
  private readonly workspaceHeight = signal(0);

  private readonly leftPanelPreferredWidth = signal<number>(this.config.leftPanel.defaultWidth);
  private readonly leftPanelActualWidth = signal<number>(this.config.leftPanel.defaultWidth);
  private readonly leftPanelCollapsed = signal(false);
  private readonly leftPanelConstraintCollapsed = signal(false);

  private readonly rightPanelPreferredWidth = signal<number>(this.config.rightPanel.defaultWidth);
  private readonly rightPanelActualWidth = signal<number>(this.config.rightPanel.defaultWidth);
  private readonly rightPanelCollapsed = signal(false);
  private readonly rightPanelConstraintCollapsed = signal(false);

  private readonly bottomPanelPreferredHeight = signal<number>(
    this.config.bottomPanel.defaultHeight,
  );
  private readonly bottomPanelActualHeight = signal<number>(this.config.bottomPanel.defaultHeight);
  private readonly bottomPanelCollapsed = signal(false);
  private readonly workAreaCollapsed = signal(false);

  private resizeObserver?: ResizeObserver;

  protected readonly leftPanelVisible = computed(
    () => !this.leftPanelCollapsed() && !this.leftPanelConstraintCollapsed(),
  );
  protected readonly rightPanelVisible = computed(
    () => !this.rightPanelCollapsed() && !this.rightPanelConstraintCollapsed(),
  );
  protected readonly bottomPanelVisible = computed(() => !this.bottomPanelCollapsed());

  protected readonly leftPanelSize = computed<ContainerSize>(() => ({
    width: this.leftPanelVisible() ? this.leftPanelActualWidth() : 0,
  }));
  protected readonly rightPanelSize = computed<ContainerSize>(() => ({
    width: this.rightPanelVisible() ? this.rightPanelActualWidth() : 0,
  }));
  protected readonly bottomPanelSize = computed<ContainerSize>(() => ({
    height: this.bottomPanelVisible() ? this.bottomPanelActualHeight() : 0,
  }));
  protected readonly workAreaVisible = computed(() => !this.workAreaCollapsed());

  ngAfterViewInit(): void {
    const workspace = this.mainWorkspace().nativeElement;
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.workspaceWidth.set(entry.contentRect.width);
      this.workspaceHeight.set(entry.contentRect.height);
      this.applyViewportConstraints();
    });

    this.resizeObserver.observe(workspace);
    this.workspaceWidth.set(workspace.clientWidth);
    this.workspaceHeight.set(workspace.clientHeight);
    this.applyViewportConstraints();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected resizeSidePanel(panel: SidePanel, size: ContainerSize): void {
    if (size.width === undefined) {
      return;
    }

    const active = this.getSidePanelState(panel);
    const opposite = this.getSidePanelState(panel === 'left' ? 'right' : 'left');
    const collapseThreshold = active.minWidth - this.config.collapseBuffer;

    if (size.width <= collapseThreshold) {
      active.collapsed.set(true);
      active.constraintCollapsed.set(false);
      active.actualWidth.set(0);
      this.applyViewportConstraints();
      return;
    }

    active.collapsed.set(false);
    active.constraintCollapsed.set(false);

    const requestedWidth = Math.max(active.minWidth, size.width);
    const availableWidth =
      this.workspaceWidth() - this.config.workArea.minWidth - this.visibleGapWidth();
    const oppositeMinWidth = opposite.collapsed() ? 0 : opposite.minWidth;
    const oppositeAvailableWidth = availableWidth - requestedWidth;

    if (requestedWidth <= availableWidth - oppositeMinWidth) {
      active.actualWidth.set(requestedWidth);

      if (!opposite.collapsed()) {
        opposite.constraintCollapsed.set(false);
        opposite.actualWidth.set(Math.min(opposite.preferredWidth(), oppositeAvailableWidth));
      }
      return;
    }

    if (!opposite.collapsed() && oppositeAvailableWidth >= opposite.minWidth) {
      active.actualWidth.set(requestedWidth);
      opposite.constraintCollapsed.set(false);
      opposite.actualWidth.set(Math.min(opposite.preferredWidth(), oppositeAvailableWidth));
      return;
    }

    if (!opposite.collapsed()) {
      opposite.constraintCollapsed.set(true);
      opposite.actualWidth.set(0);
    }

    active.actualWidth.set(Math.min(requestedWidth, availableWidth));
  }

  protected finishSidePanelResize(panel: SidePanel): void {
    const state = this.getSidePanelState(panel);
    if (!state.collapsed()) {
      state.preferredWidth.set(state.actualWidth());
    }
  }

  protected resizeBottomPanel(size: ContainerSize): void {
    if (size.height === undefined) {
      return;
    }

    const requestedHeight = Math.max(0, size.height);
    const collapseThreshold = this.config.bottomPanel.minHeight - this.config.collapseBuffer;

    if (requestedHeight <= collapseThreshold) {
      this.bottomPanelCollapsed.set(true);
      this.bottomPanelActualHeight.set(0);
      this.workAreaCollapsed.set(false);
      return;
    }

    this.bottomPanelCollapsed.set(false);

    if (requestedHeight < this.config.bottomPanel.minHeight) {
      this.bottomPanelActualHeight.set(this.config.bottomPanel.minHeight);
      this.workAreaCollapsed.set(false);
      return;
    }

    this.bottomPanelActualHeight.set(Math.min(requestedHeight, this.workspaceHeight()));
    this.workAreaCollapsed.set(requestedHeight >= this.workspaceHeight());
  }

  protected finishBottomPanelResize(): void {
    if (!this.bottomPanelCollapsed()) {
      this.bottomPanelPreferredHeight.set(this.bottomPanelActualHeight());
    }
  }

  protected toggleSidePanel(panel: SidePanel): void {
    const state = this.getSidePanelState(panel);
    state.collapsed.update((collapsed) => !collapsed);
    state.constraintCollapsed.set(false);
    state.actualWidth.set(state.collapsed() ? 0 : state.preferredWidth());

    this.applyViewportConstraints();
  }

  protected toggleBottomPanel(): void {
    this.bottomPanelCollapsed.update((collapsed) => !collapsed);
    this.bottomPanelActualHeight.set(
      this.bottomPanelCollapsed() ? 0 : this.bottomPanelPreferredHeight(),
    );
  }

  private applyViewportConstraints(): void {
    const left = this.getSidePanelState('left');
    const right = this.getSidePanelState('right');

    left.constraintCollapsed.set(false);
    left.actualWidth.set(left.collapsed() ? 0 : left.preferredWidth());

    right.constraintCollapsed.set(false);
    right.actualWidth.set(right.collapsed() ? 0 : right.preferredWidth());

    let overflow = Math.max(
      0,
      left.actualWidth() -
        right.actualWidth() +
        this.visibleGapWidth() -
        (this.workspaceWidth() - this.config.workArea.minWidth),
    );

    overflow = this.reduceSidePanelToMin(right, overflow);
    overflow = this.reduceSidePanelToMin(left, overflow);

    if (overflow > 0 && right.visible()) {
      overflow = Math.max(0, overflow - right.actualWidth());
      right.constraintCollapsed.set(true);
      right.actualWidth.set(0);
    }

    if (overflow > 0 && left.visible()) {
      left.constraintCollapsed.set(true);
      left.actualWidth.set(0);
    }
  }

  private reduceSidePanelToMin(panel: SidePanelState, overflow: number): number {
    if (overflow <= 0 || !panel.visible()) {
      return overflow;
    }

    const reduction = Math.min(Math.max(0, panel.actualWidth() - panel.minWidth), overflow);
    panel.actualWidth.update((width) => width - reduction);
    return overflow - reduction;
  }

  private visibleGapWidth(): number {
    const visiblePanels = Number(this.leftPanelVisible()) + Number(this.rightPanelVisible());
    return visiblePanels * this.config.gap;
  }

  private getSidePanelState(panel: SidePanel): SidePanelState {
    if (panel === 'left') {
      return {
        minWidth: this.config.leftPanel.minWidth,
        preferredWidth: this.leftPanelPreferredWidth,
        actualWidth: this.leftPanelActualWidth,
        collapsed: this.leftPanelCollapsed,
        constraintCollapsed: this.leftPanelConstraintCollapsed,
        visible: this.leftPanelVisible,
      };
    }

    return {
      minWidth: this.config.rightPanel.minWidth,
      preferredWidth: this.rightPanelPreferredWidth,
      actualWidth: this.rightPanelActualWidth,
      collapsed: this.rightPanelCollapsed,
      constraintCollapsed: this.rightPanelConstraintCollapsed,
      visible: this.rightPanelVisible,
    };
  }
}
