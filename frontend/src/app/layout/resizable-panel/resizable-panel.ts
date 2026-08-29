import { Component, input, output } from '@angular/core';
import {
  ContainerSize,
  ResizeDirection,
  ResizableContainer,
} from '../../shared/resizable-container/resizable-container';
import { ResizeHandle } from '../../shared/resizable-container/resize-handle';

@Component({
  imports: [ResizableContainer, ResizeHandle],
  selector: 'app-resizable-panel',
  styleUrl: './resizable-panel.css',
  templateUrl: './resizable-panel.html',
})
export class ResizablePanel {
  readonly direction = input.required<ResizeDirection>();
  readonly size = input.required<ContainerSize>();

  readonly sizeChange = output<ContainerSize>();
  readonly resizeEnd = output<ContainerSize>();
}
