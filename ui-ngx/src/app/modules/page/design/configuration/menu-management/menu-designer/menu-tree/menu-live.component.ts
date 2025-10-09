import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, HostListener, input, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'hs-menu-live',
  templateUrl: './menu-live.component.html',
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, MatIcon],
})
export class MenuLiveComponent implements OnInit {
  @ViewChild(CdkDropList) dropList!: CdkDropList;

  parentNode = input<any>();
  nodes = input<any>();
  connectedTo = input<string[]>([]);
  // 层级
  level = input<number>(0);

  mousePosition = { x: 0, y: 0 };

  constructor() {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  canEnter = (drag: CdkDrag) => {
    const isInDropContainer = this._isMouseInElement(drag.dropContainer.element.nativeElement);
    const index = this.connectedTo().indexOf(this.dropList.id);

    const dropContainerIndex = this.connectedTo().indexOf(drag.dropContainer.id);
    return !(isInDropContainer && dropContainerIndex < index);
  };

  private _isMouseInElement(droplistElement: HTMLElement): boolean {
    const rect: DOMRect = droplistElement.getBoundingClientRect();
    const { x, y } = this.mousePosition;
    const isInWidth = x >= rect.left && x <= rect.right;
    const isInHeight = y >= rect.top && y <= rect.bottom;
    return isInWidth && isInHeight;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  ngOnInit() {}
}
