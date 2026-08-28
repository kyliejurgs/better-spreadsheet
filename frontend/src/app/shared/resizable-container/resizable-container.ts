import { Component, input, output } from '@angular/core';

export type ResizeDirection =
  'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ContainerSize {
  width?: number;
  height?: number;
}

interface ResizeState {
  handle: HTMLElement;
  pointerId: number;
  startX: number;
  startY: number;
  startSize: ContainerSize;
  direction: ResizeDirection;
}

@Component({
  imports: [],
  selector: 'app-resizable-container',
  styleUrl: './resizable-container.css',
  templateUrl: './resizable-container.html',
})
export class ResizableContainer {
  readonly size = input.required<ContainerSize>();

  readonly sizeChange = output<ContainerSize>();

  private resizeState: ResizeState | null = null;

  startResize(event: PointerEvent, direction: ResizeDirection): void {
    const handle = event.currentTarget as HTMLElement;
    this.resizeState = {
      handle,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: this.size(),
      direction,
    };

    handle.classList.add('resize-handle-active');

    handle.setPointerCapture(event.pointerId);
    handle.addEventListener('pointermove', this.resize);
    handle.addEventListener('pointerup', this.stopResize);
    handle.addEventListener('pointercancel', this.stopResize);
  }

  private readonly resize = (event: PointerEvent): void => {
    const state = this.resizeState;
    if (!state || event.pointerId !== state.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    const newSize = this.calculateNewSize(state.startSize, deltaX, deltaY, state.direction);

    this.sizeChange.emit(newSize);
  };

  private readonly stopResize = (event: PointerEvent): void => {
    const state = this.resizeState;
    if (!state || event.pointerId !== state.pointerId) {
      return;
    }

    state.handle.classList.remove('resize-handle-active');

    state.handle.removeEventListener('pointermove', this.resize);
    state.handle.removeEventListener('pointerup', this.stopResize);
    state.handle.removeEventListener('pointercancel', this.stopResize);

    this.resizeState = null;
  };

  private calculateNewSize(
    startSize: ContainerSize,
    deltaX: number,
    deltaY: number,
    direction: ResizeDirection,
  ): ContainerSize {
    const newSize: ContainerSize = {};

    if (startSize.width !== undefined && this.resizableWidth(direction)) {
      const widthChange = direction.includes('left') ? -deltaX : deltaX;
      newSize.width = startSize.width + widthChange;
    }

    if (startSize.height !== undefined && this.resizableHeight(direction)) {
      const heightChange = direction.includes('top') ? -deltaY : deltaY;
      newSize.height = startSize.height + heightChange;
    }

    return newSize;
  }

  private resizableWidth(direction: ResizeDirection): boolean {
    return direction.includes('left') || direction.includes('right');
  }

  private resizableHeight(direction: ResizeDirection): boolean {
    return direction.includes('top') || direction.includes('bottom');
  }
}
