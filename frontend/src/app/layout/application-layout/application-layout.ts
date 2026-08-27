import { Component, computed, signal } from '@angular/core';
import { LogoArea } from '../logo-area/logo-area';
import { Header } from '../header/header';
import { ActivityBar } from '../activity-bar/activity-bar';
import { LeftPanel } from '../left-panel/left-panel';
import { CenterArea } from '../center-area/center-area';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';
import { APPLICATION_LAYOUT } from './application-layout.config';

@Component({
  imports: [LogoArea, Header, ActivityBar, LeftPanel, CenterArea, RightPanel, StatusBar],
  selector: 'app-application-layout',
  styleUrl: './application-layout.css',
  templateUrl: './application-layout.html',
})
export class ApplicationLayout {
  private readonly config = APPLICATION_LAYOUT;

  protected readonly leftPanelLastWidth = signal<number>(this.config.leftPanel.defaultWidth);
  protected readonly rightPanelLastWidth = signal<number>(this.config.rightPanel.defaultWidth);

  protected readonly leftPanelCollapsed = signal(false);
  protected readonly rightPanelCollapsed = signal(false);

  protected readonly leftPanelActualWidth = computed(() =>
    this.leftPanelCollapsed() ? 0 : this.leftPanelLastWidth(),
  );
  protected readonly rightPanelActualWidth = computed(() =>
    this.rightPanelCollapsed() ? 0 : this.rightPanelLastWidth(),
  );
}
