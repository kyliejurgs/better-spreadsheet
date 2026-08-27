import { Component } from '@angular/core';
import { TabBar } from './tab-bar/tab-bar';
import { WorkSurface } from './work-surface/work-surface';

@Component({
  imports: [TabBar, WorkSurface],
  selector: 'app-work-area',
  styleUrl: './work-area.css',
  templateUrl: './work-area.html',
})
export class WorkArea {}
