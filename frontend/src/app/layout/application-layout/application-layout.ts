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
  private readonly applicationWidth = signal(0);
  private readonly applicationHeight = signal(0);

  protected readonly leftPanelWidth = signal(0);
  protected readonly rightPanelWidth = signal(0);
  protected readonly bottomPanelHeight = signal(0);

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
    if (event.width === undefined) {
      return;
    }
    this.leftPanelWidth.set(event.width);
  }

  protected resizeRightPanel(event: ResizeEvent): void {
    if (event.width === undefined) {
      return;
    }
    this.rightPanelWidth.set(event.width);
  }

  protected resizeBottomPanel(event: ResizeEvent): void {
    if (event.height === undefined) {
      return;
    }
    this.bottomPanelHeight.set(event.height);
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
    this.leftPanelWidth.set(this.readConfiguredPixels('--left-panel-width'));
    this.rightPanelWidth.set(this.readConfiguredPixels('--right-panel-width'));
    this.bottomPanelHeight.set(this.readConfiguredPixels('--bottom-panel-height'));
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
}
