import { Component, computed, signal } from '@angular/core';
import { LogoArea } from '../logo-area/logo-area';
import { Header } from '../header/header';
import { ActivityBar } from '../activity-bar/activity-bar';
import { LeftPanel } from '../left-panel/left-panel';
import { CenterArea } from '../center-area/center-area';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';
import { APPLICATION_LAYOUT } from './application-layout.config';
import {
  ContainerSize,
  ResizableContainer,
} from '../../shared/resizable-container/resizable-container';
import { ResizeHandle } from '../../shared/resizable-container/resize-handle';

@Component({
  imports: [
    LogoArea,
    Header,
    ActivityBar,
    LeftPanel,
    CenterArea,
    RightPanel,
    StatusBar,
    ResizableContainer,
    ResizeHandle,
  ],
  selector: 'app-application-layout',
  styleUrl: './application-layout.css',
  templateUrl: './application-layout.html',
})
export class ApplicationLayout {
  private readonly config = APPLICATION_LAYOUT;

  protected readonly leftPanelLastWidth = signal<number>(this.config.leftPanel.defaultWidth);
  protected readonly rightPanelLastWidth = signal<number>(this.config.rightPanel.defaultWidth);
  protected readonly bottomPanelLastHeight = signal<number>(this.config.bottomPanel.defaultHeight);

  protected readonly leftPanelCollapsed = signal(false);
  protected readonly rightPanelCollapsed = signal(false);
  protected readonly bottomPanelCollapsed = signal(false);

  protected readonly leftPanelActualWidth = computed(() =>
    this.leftPanelCollapsed() ? 0 : this.leftPanelLastWidth(),
  );
  protected readonly rightPanelActualWidth = computed(() =>
    this.rightPanelCollapsed() ? 0 : this.rightPanelLastWidth(),
  );
  protected readonly bottomPanelActualHeight = computed(() =>
    this.bottomPanelCollapsed() ? 0 : this.bottomPanelLastHeight(),
  );

  protected resizeLeftPanel(size: ContainerSize): void {
    if (size.width === undefined) {
      return;
    }
    this.leftPanelLastWidth.set(Math.max(this.config.leftPanel.minWidth, size.width));
  }

  protected resizeRightPanel(size: ContainerSize): void {
    if (size.width === undefined) {
      return;
    }
    this.rightPanelLastWidth.set(Math.max(this.config.rightPanel.minWidth, size.width));
  }

  protected resizeBottomPanel(size: ContainerSize): void {
    if (size.height === undefined) {
      return;
    }

    this.bottomPanelLastHeight.set(Math.max(this.config.bottomPanel.minHeight, size.height));
  }
}
