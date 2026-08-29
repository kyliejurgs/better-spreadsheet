import { Component, input, output } from '@angular/core';
import { WorkArea } from './work-area/work-area';
import { BottomPanel } from './bottom-panel/bottom-panel';
import { ContainerSize } from '../../shared/resizable-container/resizable-container';
import { ResizablePanel } from '../resizable-panel/resizable-panel';

@Component({
  imports: [WorkArea, BottomPanel, ResizablePanel],
  selector: 'app-center-area',
  styleUrl: './center-area.css',
  templateUrl: './center-area.html',
})
export class CenterArea {
  readonly bottomPanelSize = input.required<ContainerSize>();
  readonly bottomPanelVisible = input.required<boolean>();

  readonly bottomPanelSizeChange = output<ContainerSize>();
}
