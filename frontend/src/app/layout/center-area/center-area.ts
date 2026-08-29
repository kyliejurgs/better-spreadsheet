import { Component, input, output } from '@angular/core';
import { WorkArea } from './work-area/work-area';
import { BottomPanel } from './bottom-panel/bottom-panel';
import {
  ContainerSize,
  ResizableContainer,
} from '../../shared/resizable-container/resizable-container';
import { ResizeHandle } from '../../shared/resizable-container/resize-handle';
import { ResizablePanel } from '../resizable-panel/resizable-panel';

@Component({
  imports: [WorkArea, BottomPanel, ResizablePanel],
  selector: 'app-center-area',
  styleUrl: './center-area.css',
  templateUrl: './center-area.html',
})
export class CenterArea {
  readonly bottomPanelHeight = input.required<number>();
  readonly bottomPanelHeightChange = output<ContainerSize>();
}
