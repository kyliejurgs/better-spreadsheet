import { Directive, inject, input } from '@angular/core';
import { ResizableContainer, ResizeDirection } from './resizable-container';

@Directive({
  selector: '[resizeHandle]',
  host: {
    '(pointerdown)': 'startResize($event)',
  },
})
export class ResizeHandle {
  readonly direction = input.required<ResizeDirection>({
    alias: 'resizeHandle',
  });

  private readonly container = inject(ResizableContainer);

  protected startResize(event: PointerEvent): void {
    this.container.startResize(event, this.direction());
  }
}
