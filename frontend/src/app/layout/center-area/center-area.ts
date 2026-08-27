import { Component } from '@angular/core';
import { WorkArea } from './work-area/work-area';
import { BottomPanel } from './bottom-panel/bottom-panel';

@Component({
  imports: [WorkArea, BottomPanel],
  selector: 'app-center-area',
  styleUrl: './center-area.css',
  templateUrl: './center-area.html',
})
export class CenterArea {}
