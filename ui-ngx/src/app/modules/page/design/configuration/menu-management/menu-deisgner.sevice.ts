import { Injectable, signal } from '@angular/core';
import { sign } from 'crypto';

@Injectable({ providedIn: 'root' })
export class MenuDesignerService {
  mousePosition = { x: 0, y: 0 };
  // 是否在拖拽中
  isDragging = signal<boolean>(false);

  constructor() {}

  onMouseMove(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
  }

  toggleDragging(isDragging: boolean): void {
    this.isDragging.set(isDragging);
  }
}
