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
  private readonly config = APPLICATION_LAYOUT;
  private readonly mainWorkspace = viewChild.required<ElementRef<HTMLElement>>('mainWorkspace');
  private readonly workspaceWidth = signal(0);

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

  ngAfterViewInit(): void {
    const workspace = this.mainWorkspace().nativeElement;
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.workspaceWidth.set(entry.contentRect.width);
      this.applyViewportConstraints();
    });

    this.resizeObserver.observe(workspace);
    this.workspaceWidth.set(workspace.clientWidth);
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

    if (size.width < active.minWidth) {
      active.collapsed.set(true);
      active.constraintCollapsed.set(false);
      active.actualWidth.set(0);
      this.applyViewportConstraints();
      return;
    }

    active.collapsed.set(false);
    active.constraintCollapsed.set(false);

    const availableWidth = this.availablePanelWidth();
    const oppositeMinWidth = opposite.collapsed() ? 0 : opposite.minWidth;
    const oppositeAvailableWidth = availableWidth - size.width;

    if (size.width <= availableWidth - oppositeMinWidth) {
      active.preferredWidth.set(size.width);
      active.actualWidth.set(size.width);

      if (opposite.collapsed()) {
        opposite.constraintCollapsed.set(false);
        opposite.actualWidth.set(0);
        return;
      }

      opposite.constraintCollapsed.set(false);
      opposite.actualWidth.set(Math.min(opposite.preferredWidth(), oppositeAvailableWidth));

      return;
    }

    if (!opposite.collapsed() && oppositeAvailableWidth >= opposite.minWidth) {
      active.preferredWidth.set(size.width);
      active.actualWidth.set(size.width);
      opposite.constraintCollapsed.set(false);
      opposite.actualWidth.set(Math.min(opposite.preferredWidth(), oppositeAvailableWidth));
      return;
    }

    if (!opposite.collapsed()) {
      opposite.constraintCollapsed.set(true);
      opposite.actualWidth.set(0);
    }

    const actualWidth = Math.min(size.width, availableWidth);
    active.preferredWidth.set(actualWidth);
    active.actualWidth.set(actualWidth);
  }

  protected resizeBottomPanel(size: ContainerSize): void {
    if (size.height === undefined) {
      return;
    }

    if (size.height < this.config.bottomPanel.minHeight) {
      this.bottomPanelCollapsed.set(true);
      this.bottomPanelActualHeight.set(0);
      return;
    }

    this.bottomPanelCollapsed.set(false);
    this.bottomPanelPreferredHeight.set(size.height);
    this.bottomPanelActualHeight.set(size.height);
  }

  protected toggleSidePanel(panel: SidePanel): void {
    const state = this.getSidePanelState(panel);
    if (state.collapsed()) {
      state.collapsed.set(false);
    } else {
      state.collapsed.set(true);
      state.constraintCollapsed.set(false);
      state.actualWidth.set(0);
    }

    this.applyViewportConstraints();
  }

  protected toggleBottomPanel(): void {
    if (this.bottomPanelCollapsed()) {
      this.bottomPanelCollapsed.set(false);
      this.bottomPanelActualHeight.set(this.bottomPanelPreferredHeight());
      return;
    }

    this.bottomPanelCollapsed.set(true);
    this.bottomPanelActualHeight.set(0);
  }

  private applyViewportConstraints(): void {
    const left = this.getSidePanelState('left');
    const right = this.getSidePanelState('right');

    left.constraintCollapsed.set(false);
    right.constraintCollapsed.set(false);

    if (left.collapsed()) {
      left.actualWidth.set(0);
    } else {
      left.actualWidth.set(left.preferredWidth());
    }

    if (right.collapsed()) {
      right.actualWidth.set(0);
    } else {
      right.actualWidth.set(right.preferredWidth());
    }

    let overflow = Math.max(
      0,
      left.actualWidth() +
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

  private availablePanelWidth(): number {
    const freeSpace =
      this.workspaceWidth() - this.config.workArea.minWidth - this.visibleGapWidth();
    return Math.max(0, freeSpace);
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
