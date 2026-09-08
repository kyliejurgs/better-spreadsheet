import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
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
import { CommandBar } from '../command-bar/command-bar';
import { LeftPanelView } from '../../core/ui-state/application-ui-state.model';
import { calculateSidePanelLayout, SidePanel } from './side-panel-layout';
import { ApplicationUiStateService } from '../../core/ui-state/application-ui-state.service';
import { ResizablePanel } from '../../shared/resizable-panel/resizable-panel';

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
    CommandBar,
  ],
  selector: 'app-application-layout',
  styleUrl: './application-layout.css',
  templateUrl: './application-layout.html',
})
export class ApplicationLayout implements AfterViewInit, OnDestroy {
  private readonly uiState = inject(ApplicationUiStateService);

  protected readonly config = APPLICATION_LAYOUT;
  protected readonly applicationHeaderHeight =
    this.config.fixed.titleBarHeight + this.config.fixed.menuBarHeight;

  protected readonly activeLeftPanelView = this.uiState.activeLeftPanelView;

  private readonly mainWorkspace = viewChild.required<ElementRef<HTMLElement>>('mainWorkspace');
  private readonly workspaceWidth = signal(0);
  private readonly workspaceHeight = signal(0);

  // Preferred dimensions represent user intent. Effective dimensions are derived.
  private readonly leftPanelPreferredWidth = this.uiState.leftPanelPreferredWidth;
  private readonly rightPanelPreferredWidth = this.uiState.rightPanelPreferredWidth;
  private readonly bottomPanelPreferredHeight = this.uiState.bottomPanelPreferredHeight;

  private readonly leftPanelCollapsed = this.uiState.leftPanelCollapsed;
  private readonly rightPanelCollapsed = this.uiState.rightPanelCollapsed;
  private readonly bottomPanelCollapsed = this.uiState.bottomPanelCollapsed;
  private readonly workAreaCollapsed = signal(false);

  // Effective and interaction state depend on the current viewport
  private readonly activeSidePanel = signal<SidePanel | null>(null);
  private readonly bottomPanelActualHeight = signal(this.bottomPanelPreferredHeight());

  private resizeObserver?: ResizeObserver;

  private readonly sidePanelLayout = computed(() =>
    calculateSidePanelLayout({
      workspaceWidth: this.workspaceWidth(),
      workAreaMinWidth: this.config.workArea.minWidth,
      gap: this.config.gap,
      collapseBuffer: this.config.constraintCollapseBuffer,
      activePanel: this.activeSidePanel(),
      leftPreferredWidth: this.leftPanelPreferredWidth(),
      leftMinWidth: this.config.leftPanel.minWidth,
      leftCollapsed: this.leftPanelCollapsed(),
      rightPreferredWidth: this.rightPanelPreferredWidth(),
      rightMinWidth: this.config.rightPanel.minWidth,
      rightCollapsed: this.rightPanelCollapsed(),
    }),
  );

  protected readonly leftPanelVisible = computed(
    () => !this.leftPanelCollapsed() && !this.sidePanelLayout().leftConstraintCollapsed,
  );
  protected readonly rightPanelVisible = computed(
    () => !this.rightPanelCollapsed() && !this.sidePanelLayout().rightConstraintCollapsed,
  );
  protected readonly bottomPanelVisible = computed(() => !this.bottomPanelCollapsed());

  protected readonly leftPanelSize = computed<ContainerSize>(() => ({
    width: this.leftPanelVisible() ? this.sidePanelLayout().leftWidth : 0,
  }));
  protected readonly rightPanelSize = computed<ContainerSize>(() => ({
    width: this.rightPanelVisible() ? this.sidePanelLayout().rightWidth : 0,
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
      this.applyBottomPanelConstraints();
    });

    this.resizeObserver.observe(workspace);
    this.workspaceWidth.set(workspace.clientWidth);
    this.workspaceHeight.set(workspace.clientHeight);
    this.applyBottomPanelConstraints();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected async selectLeftPanelView(view: LeftPanelView): Promise<void> {
    this.activeLeftPanelView.set(view);
    await this.uiState.save();
  }

  protected resizeSidePanel(panel: SidePanel, size: ContainerSize): void {
    if (size.width === undefined) {
      return;
    }

    this.activeSidePanel.set(panel);

    const requestedWidth = Math.max(0, size.width);
    if (requestedWidth === 0) {
      this.getSidePanelCollapsed(panel).set(true);
      return;
    }

    this.getSidePanelCollapsed(panel).set(false);

    const preferredWidth = Math.max(this.getSidePanelMinWidth(panel), requestedWidth);

    this.getSidePanelPreferredWidth(panel).set(preferredWidth);
  }

  protected async finishSidePanelResize(_panel: SidePanel): Promise<void> {
    this.activeSidePanel.set(null);
    await this.uiState.save();
  }

  protected resizeBottomPanel(size: ContainerSize): void {
    if (size.height === undefined) {
      return;
    }

    const requestedHeight = Math.max(0, size.height);
    if (requestedHeight === 0) {
      this.bottomPanelCollapsed.set(true);
      this.bottomPanelActualHeight.set(0);
      this.workAreaCollapsed.set(false);
      return;
    }

    this.bottomPanelCollapsed.set(false);
    const requestedActualHeight = Math.max(this.config.bottomPanel.minHeight, requestedHeight);

    const centerHeight = this.workspaceHeight();
    const maxHeightWithWorkArea = centerHeight - this.config.workArea.minHeight - this.config.gap;

    // Work area can be collapsed by intentional drag of bottom panel to take full workspace height
    if (requestedHeight >= centerHeight) {
      this.workAreaCollapsed.set(true);
      this.bottomPanelActualHeight.set(centerHeight);
      return;
    }

    this.workAreaCollapsed.set(false);
    this.bottomPanelActualHeight.set(Math.min(requestedActualHeight, maxHeightWithWorkArea));
  }

  protected async finishBottomPanelResize(): Promise<void> {
    if (!this.bottomPanelCollapsed() && !this.workAreaCollapsed()) {
      this.bottomPanelPreferredHeight.set(this.bottomPanelActualHeight());
    }
    await this.uiState.save();
  }

  protected async toggleSidePanel(panel: SidePanel): Promise<void> {
    const collapsed = this.getSidePanelCollapsed(panel);
    collapsed.update((value: boolean) => !value);
    await this.uiState.save();
  }

  protected async toggleBottomPanel(): Promise<void> {
    this.bottomPanelCollapsed.update((collapsed: boolean) => !collapsed);
    this.applyBottomPanelConstraints();
    await this.uiState.save();
  }

  private applyBottomPanelConstraints(): void {
    if (this.bottomPanelCollapsed()) {
      this.bottomPanelActualHeight.set(0);
      this.workAreaCollapsed.set(false);
      return;
    }

    const maxHeight = this.workspaceHeight() - this.config.workArea.minHeight - this.config.gap;

    this.bottomPanelActualHeight.set(
      Math.min(
        this.bottomPanelPreferredHeight(),
        Math.max(this.config.bottomPanel.minHeight, maxHeight),
      ),
    );

    this.workAreaCollapsed.set(false);
  }

  private getSidePanelPreferredWidth(panel: SidePanel) {
    return panel === 'left' ? this.leftPanelPreferredWidth : this.rightPanelPreferredWidth;
  }

  private getSidePanelCollapsed(panel: SidePanel) {
    return panel === 'left' ? this.leftPanelCollapsed : this.rightPanelCollapsed;
  }

  private getSidePanelMinWidth(panel: SidePanel): number {
    return panel === 'left' ? this.config.leftPanel.minWidth : this.config.rightPanel.minWidth;
  }
}
