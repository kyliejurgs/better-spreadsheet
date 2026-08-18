import { Component } from '@angular/core';
import { ActivityBar } from '../activity-bar/activity-bar';
import { BottomPanel } from '../bottom-panel/bottom-panel';
import { LeftPanel } from '../left-panel/left-panel';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';
import { TopBar } from '../top-bar/top-bar';
import { WorkArea } from '../work-area/work-area';

@Component({
  selector: 'app-application-layout',
  imports: [ActivityBar, BottomPanel, LeftPanel, RightPanel, StatusBar, TopBar, WorkArea],
  templateUrl: './application-layout.html',
  styleUrl: './application-layout.css',
})
export class ApplicationLayout {}
