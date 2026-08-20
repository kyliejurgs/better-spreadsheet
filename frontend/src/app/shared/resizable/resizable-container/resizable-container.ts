import { Component, ElementRef, inject, input, output } from '@angular/core';

export type ResizeHandle =
  'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ResizeHandles = ResizeHandle | ResizeHandle[] | 'all';

export type ResizeEvent = {
  width?: number;
  height?: number;
  dragWidth?: number;
  dragHeight?: number;
  handle: ResizeHandle;
};

@Component({
  selector: 'app-resizable-container',
  templateUrl: './resizable-container.html',
  styleUrl: './resizable-container.css',
})
export class ResizableContainer {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly handles = input<ResizeHandles>();
  readonly minWidth = input<number>();
  readonly maxWidth = input<number>();
  readonly minHeight = input<number>();
  readonly maxHeight = input<number>();

  readonly resize = output<ResizeEvent>();

  private activeHandle: ResizeHandle | undefined;

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  protected hasHandle(handle: ResizeHandle): boolean {
    const handles = this.handles();

    if (!handles) {
      return false;
    }

    if (handles === 'all') {
      return true;
    }

    if (Array.isArray(handles)) {
      return handles.includes(handle);
    }

    return handles === handle;
  }

  protected startResize(event: PointerEvent, handle: ResizeHandle): void {
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();

    this.activeHandle = handle;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = bounds.width;
    this.startHeight = bounds.height;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected resizeToPointer(event: PointerEvent): void {
    if (!this.activeHandle) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    const resizeEvent: ResizeEvent = { handle: this.activeHandle };

    if (this.activeHandle.includes('right')) {
      this.setWidth(resizeEvent, this.startWidth + deltaX);
    }

    if (this.activeHandle.includes('left')) {
      this.setWidth(resizeEvent, this.startWidth - deltaX);
    }

    if (this.activeHandle.includes('bottom')) {
      this.setHeight(resizeEvent, this.startHeight + deltaY);
    }

    if (this.activeHandle.includes('top')) {
      this.setHeight(resizeEvent, this.startHeight - deltaY);
    }

    this.resize.emit(resizeEvent);
  }

  protected stopResize(event: PointerEvent): void {
    this.activeHandle = undefined;
    const handle = event.currentTarget as HTMLElement;
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  }

  private setWidth(event: ResizeEvent, dragWidth: number): void {
    event.dragWidth = dragWidth;
    event.width = this.constrainSize(dragWidth, this.minWidth(), this.maxWidth());
  }

  private setHeight(event: ResizeEvent, dragHeight: number): void {
    event.dragHeight = dragHeight;
    event.height = this.constrainSize(dragHeight, this.minHeight(), this.maxHeight());
  }

  private constrainSize(size: number, min = 0, max = Number.POSITIVE_INFINITY): number {
    return Math.min(Math.max(size, min), max);
  }
}
