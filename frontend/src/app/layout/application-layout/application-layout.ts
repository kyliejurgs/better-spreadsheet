import { Component } from '@angular/core';
import { LogoArea } from '../logo-area/logo-area';
import { Header } from '../header/header';
import { ActivityBar } from '../activity-bar/activity-bar';
import { LeftPanel } from '../left-panel/left-panel';
import { CenterArea } from '../center-area/center-area';
import { RightPanel } from '../right-panel/right-panel';
import { StatusBar } from '../status-bar/status-bar';

@Component({
  imports: [LogoArea, Header, ActivityBar, LeftPanel, CenterArea, RightPanel, StatusBar],
  selector: 'app-application-layout',
  styleUrl: './application-layout.css',
  templateUrl: './application-layout.html',
})
export class ApplicationLayout {}
