import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal } from '@angular/core';
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

@Component({
  selector: 'app-application-layout',
  imports: [
    ActivityBar,
    BottomPanel,
    LeftPanel,
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
  private readonly panelCollapseThreshold = 60;
  private readonly applicationWidth = signal(0);
  private readonly applicationHeight = signal(0);

  protected readonly leftPanelWidth = signal(0);
  protected readonly rightPanelWidth = signal(0);
  protected readonly bottomPanelHeight = signal(0);

  protected readonly leftPanelCollapsed = signal(false);
  protected readonly rightPanelCollapsed = signal(false);
  protected readonly bottomPanelCollapsed = signal(false);

  private leftPanelExpandedWidth = 0;
  private rightPanelExpandedWidth = 0;
  private bottomPanelExpandedHeight = 0;

  protected leftPanelMinWidth = 0;
  protected rightPanelMinWidth = 0;
  protected bottomPanelMinHeight = 0;

  private activityBarWidth = 0;
  private workAreaMinWidth = 0;
  private workAreaMinHeight = 0;
  private topBarHeight = 0;
  private statusBarHeight = 0;

  private resizeObserver: ResizeObserver | undefined;

  protected getLeftPanelMaxWidth(): number {
    return Math.max(
      this.leftPanelMinWidth,
      this.applicationWidth() -
        this.activityBarWidth -
        this.rightPanelWidth() -
        this.workAreaMinWidth,
    );
  }

  protected getRightPanelMaxWidth(): number {
    return Math.max(
      this.rightPanelMinWidth,
      this.applicationWidth() -
        this.activityBarWidth -
        this.leftPanelWidth() -
        this.workAreaMinWidth,
    );
  }

  protected getBottomPanelMaxHeight(): number {
    return Math.max(
      this.bottomPanelMinHeight,
      this.applicationHeight() - this.topBarHeight - this.statusBarHeight - this.workAreaMinHeight,
    );
  }

  ngAfterViewInit(): void {
    this.initializeLayoutConfiguration();
    this.resizeObserver = new ResizeObserver(() => {
      this.updateApplicationSize();
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);
    this.updateApplicationSize();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected resizeLeftPanel(event: ResizeEvent): void {
    if (event.width === undefined || event.dragWidth === undefined) {
      return;
    }

    const collapseWidth = this.leftPanelMinWidth - this.panelCollapseThreshold;
    if (event.dragWidth <= collapseWidth) {
      this.leftPanelWidth.set(0);
      this.leftPanelCollapsed.set(true);
      return;
    }

    this.leftPanelCollapsed.set(false);
    this.leftPanelWidth.set(event.width);
    this.leftPanelExpandedWidth = event.width;
  }

  protected resizeRightPanel(event: ResizeEvent): void {
    if (event.width === undefined || event.dragWidth === undefined) {
      return;
    }

    const collapseWidth = this.rightPanelMinWidth - this.panelCollapseThreshold;
    if (event.dragWidth <= collapseWidth) {
      this.rightPanelWidth.set(0);
      this.rightPanelCollapsed.set(true);
      return;
    }

    this.rightPanelCollapsed.set(false);
    this.rightPanelWidth.set(event.width);
    this.rightPanelExpandedWidth = event.width;
  }

  protected resizeBottomPanel(event: ResizeEvent): void {
    if (event.height === undefined || event.dragHeight === undefined) {
      return;
    }

    const collapseHeight = this.bottomPanelMinHeight - this.panelCollapseThreshold;
    if (event.dragHeight <= collapseHeight) {
      this.bottomPanelHeight.set(0);
      this.bottomPanelCollapsed.set(true);
      return;
    }

    this.bottomPanelCollapsed.set(false);
    this.bottomPanelHeight.set(event.height);
    this.bottomPanelExpandedHeight = event.height;
  }

  private initializeLayoutConfiguration(): void {
    this.activityBarWidth = this.readConfiguredPixels('--activity-bar-width');
    this.leftPanelMinWidth = this.readConfiguredPixels('--left-panel-min-width');
    this.rightPanelMinWidth = this.readConfiguredPixels('--right-panel-min-width');
    this.bottomPanelMinHeight = this.readConfiguredPixels('--bottom-panel-min-height');
    this.workAreaMinWidth = this.readConfiguredPixels('--work-area-min-width');
    this.workAreaMinHeight = this.readConfiguredPixels('--work-area-min-height');
    this.topBarHeight = this.readConfiguredPixels('--top-bar-height');
    this.statusBarHeight = this.readConfiguredPixels('--status-bar-height');

    const leftPanelWidth = this.readConfiguredPixels('--left-panel-width');
    const rightPanelWidth = this.readConfiguredPixels('--right-panel-width');
    const bottomPanelHeight = this.readConfiguredPixels('--bottom-panel-height');

    this.leftPanelWidth.set(leftPanelWidth);
    this.rightPanelWidth.set(rightPanelWidth);
    this.bottomPanelHeight.set(bottomPanelHeight);

    this.leftPanelExpandedWidth = leftPanelWidth;
    this.rightPanelExpandedWidth = rightPanelWidth;
    this.bottomPanelExpandedHeight = bottomPanelHeight;
  }

  private updateApplicationSize(): void {
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.applicationWidth.set(bounds.width);
    this.applicationHeight.set(bounds.height);
  }

  private readConfiguredPixels(property: string): number {
    const styles = getComputedStyle(this.elementRef.nativeElement);
    const value = styles.getPropertyValue(property);
    return Number.parseFloat(value);
  }

  protected toggleLeftPanel(): void {
    if (this.leftPanelCollapsed()) {
      this.leftPanelWidth.set(this.leftPanelExpandedWidth);
      this.leftPanelCollapsed.set(false);
      return;
    }

    this.leftPanelExpandedWidth = this.leftPanelWidth();
    this.leftPanelWidth.set(0);
    this.leftPanelCollapsed.set(true);
  }

  protected toggleRightPanel(): void {
    if (this.rightPanelCollapsed()) {
      this.rightPanelWidth.set(this.rightPanelExpandedWidth);
      this.rightPanelCollapsed.set(false);
      return;
    }

    this.rightPanelExpandedWidth = this.rightPanelWidth();
    this.rightPanelWidth.set(0);
    this.rightPanelCollapsed.set(true);
  }

  protected toggleBottomPanel(): void {
    if (this.bottomPanelCollapsed()) {
      this.bottomPanelHeight.set(this.bottomPanelExpandedHeight);
      this.bottomPanelCollapsed.set(false);
      return;
    }

    this.bottomPanelExpandedHeight = this.bottomPanelHeight();
    this.bottomPanelHeight.set(0);
    this.bottomPanelCollapsed.set(true);
  }
}
