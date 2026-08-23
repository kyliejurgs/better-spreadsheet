import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivityBar } from '../activity-bar/activity-bar';
import { BottomPanel } from '../bottom-panel/bottom-panel';
import { LeftPanel } from '../left-panel/left-panel';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';
import { TopBar } from '../top-bar/top-bar';
import { WorkArea } from '../work-area/work-area';
import {
  ResizableContainer,
  ResizeEvent,
} from '../../shared/resizable/resizable-container/resizable-container';
import { APPLICATION_LAYOUT } from '../../config/application-layout.config';
import { MenuBar } from '../menu-bar/menu-bar';

@Component({
  selector: 'app-application-layout',
  imports: [
    ActivityBar,
    BottomPanel,
    LeftPanel,
    MenuBar,
    ResizableContainer,
    RightPanel,
    StatusBar,
    TopBar,
    WorkArea,
  ],
  templateUrl: './application-layout.html',
  styleUrl: './application-layout.css',
})
export class ApplicationLayout implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly applicationWidth = signal(0);
  private readonly applicationHeight = signal(0);

  protected readonly config = APPLICATION_LAYOUT;

  protected readonly leftPanelWidth = signal<number>(this.config.leftPanel.defaultWidth);
  protected readonly rightPanelWidth = signal<number>(this.config.rightPanel.defaultWidth);
  protected readonly bottomPanelHeight = signal<number>(this.config.bottomPanel.defaultHeight);

  protected readonly leftPanelCollapsed = signal(false);
  protected readonly rightPanelCollapsed = signal(false);
  protected readonly bottomPanelCollapsed = signal(false);

  protected readonly leftPanelMinWidth = this.config.leftPanel.minWidth;
  protected readonly rightPanelMinWidth = this.config.rightPanel.minWidth;
  protected readonly bottomPanelMinHeight = this.config.bottomPanel.minHeight;

  private readonly topBarHeight = this.config.topBar.height;
  private readonly menuBarHeight = this.config.menuBar.height;
  private readonly activityBarWidth = this.config.activityBar.width;
  private readonly statusBarHeight = this.config.statusBar.height;
  private readonly workAreaMinWidth = this.config.workArea.minWidth;
  private readonly workAreaMinHeight = this.config.workArea.minHeight;
  private readonly panelCollapseThreshold = this.config.resize.collapseThreshold;

  private resizeObserver: ResizeObserver | undefined;

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateApplicationSize();
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);
    this.updateApplicationSize();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected getSidePanelMaxWidth(): number {
    return this.applicationWidth() - this.activityBarWidth - this.workAreaMinWidth;
  }

  protected getBottomPanelMaxHeight(): number {
    return Math.max(
      this.bottomPanelMinHeight,
      this.applicationHeight() -
        this.topBarHeight -
        this.menuBarHeight -
        this.statusBarHeight -
        this.workAreaMinHeight,
    );
  }

  protected resizeLeftPanel(event: ResizeEvent): void {
    this.resizeSidePanel(
      event,
      this.leftPanelWidth,
      this.leftPanelCollapsed,
      this.leftPanelMinWidth,
      this.rightPanelWidth,
      this.rightPanelCollapsed,
      this.rightPanelMinWidth,
    );
  }

  protected resizeRightPanel(event: ResizeEvent): void {
    this.resizeSidePanel(
      event,
      this.rightPanelWidth,
      this.rightPanelCollapsed,
      this.rightPanelMinWidth,
      this.leftPanelWidth,
      this.leftPanelCollapsed,
      this.leftPanelMinWidth,
    );
  }

  protected resizeBottomPanel(event: ResizeEvent): void {
    if (event.height === undefined || event.dragHeight === undefined) {
      return;
    }

    if (this.shouldCollapse(event.dragHeight, this.bottomPanelMinHeight)) {
      this.bottomPanelHeight.set(0);
      this.bottomPanelCollapsed.set(true);
      return;
    }

    this.bottomPanelHeight.set(event.height);
    this.bottomPanelCollapsed.set(false);
  }

  private resizeSidePanel(
    event: ResizeEvent,
    panelWidth: WritableSignal<number>,
    panelCollapsed: WritableSignal<boolean>,
    panelMinWidth: number,
    oppositePanelWidth: WritableSignal<number>,
    oppositePanelCollapsed: WritableSignal<boolean>,
    oppositePanelMinWidth: number,
  ) {
    if (event.width === undefined || event.dragWidth === undefined) {
      return;
    }

    if (this.shouldCollapse(event.dragWidth, panelMinWidth)) {
      panelWidth.set(0);
      panelCollapsed.set(true);
      return;
    }

    const currentWidth = panelWidth();
    const widthChange = event.width - currentWidth;
    if (widthChange <= 0) {
      panelWidth.set(event.width);
      panelCollapsed.set(false);
      return;
    }

    const availableWorkAreaWidth = Math.max(0, this.getWorkAreaWidth() - this.workAreaMinWidth);
    const widthNeededFromOpposite = Math.max(0, widthChange - availableWorkAreaWidth);
    const widthFreedFromOpposite = this.shrinkPanel(
      widthNeededFromOpposite,
      oppositePanelWidth,
      oppositePanelCollapsed,
      oppositePanelMinWidth,
    );
    const allowedWidthChange = availableWorkAreaWidth + widthFreedFromOpposite;

    panelWidth.set(Math.min(event.width, currentWidth + allowedWidthChange));
    panelCollapsed.set(false);
  }

  private shrinkPanel(
    amount: number,
    panelWidth: WritableSignal<number>,
    panelCollapsed: WritableSignal<boolean>,
    panelMinWidth: number,
  ): number {
    const currentWidth = panelWidth();
    if (amount <= 0 || currentWidth === 0) {
      return 0;
    }

    const dragWidth = currentWidth - amount;
    if (this.shouldCollapse(dragWidth, panelMinWidth)) {
      panelWidth.set(0);
      panelCollapsed.set(true);
      return currentWidth;
    }

    const newWidth = Math.max(panelMinWidth, dragWidth);
    panelWidth.set(newWidth);
    panelCollapsed.set(false);

    return currentWidth - newWidth;
  }

  private shouldCollapse(size: number, minSize: number): boolean {
    return size <= minSize - this.panelCollapseThreshold;
  }

  private getWorkAreaWidth(): number {
    return (
      this.applicationWidth() -
      this.activityBarWidth -
      this.leftPanelWidth() -
      this.rightPanelWidth()
    );
  }

  private updateApplicationSize(): void {
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.applicationWidth.set(bounds.width);
    this.applicationHeight.set(bounds.height);
  }
}
