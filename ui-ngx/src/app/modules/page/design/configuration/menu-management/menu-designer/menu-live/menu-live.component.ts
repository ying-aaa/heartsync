import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, HostListener, input, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MenuDesignerService } from '../../menu-deisgner.sevice';
import { generateUUID } from '@src/app/core/utils';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'hs-menu-live',
  templateUrl: './menu-live.component.html',
  imports: [CdkDropList, CdkDrag, MatIcon, MatDivider],
})
export class MenuLiveComponent implements OnInit {
  @ViewChild(CdkDropList) dropList!: CdkDropList;

  parentNode = input<any>();
  nodes = input<any>();
  connectedTo = input<string[]>([]);
  // 层级
  level = input<number>(0);

  isDragging = computed(() => this.menuDeSignerService.isDragging());

  constructor(private menuDeSignerService: MenuDesignerService) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.menuDeSignerService.onMouseMove(event);
  }

  toggleDragging(isDragging: boolean): void {
    this.menuDeSignerService.toggleDragging(isDragging);
  }

  canEnter = (drag: CdkDrag) => {
    const isInDropContainer = this._isMouseInElement(drag.dropContainer.element.nativeElement);
    const index = this.connectedTo().indexOf(this.dropList.id);

    const dropContainerIndex = this.connectedTo().indexOf(drag.dropContainer.id);
    return !(isInDropContainer && dropContainerIndex < index);
  };

  private _isMouseInElement(droplistElement: HTMLElement): boolean {
    const rect: DOMRect = droplistElement.getBoundingClientRect();
    const { x, y } = this.menuDeSignerService.mousePosition;
    const isInWidth = x >= rect.left && x <= rect.right;
    const isInHeight = y >= rect.top && y <= rect.bottom;
    return isInWidth && isInHeight;
  }

  drop(event: CdkDragDrop<string[]>) {
    const fromData = event.item.data;

    if (fromData) {
      const assignId = (data: any) => {
        fromData.id = generateUUID();
        if (data.children) {
          data.children.forEach(assignId);
        }
      };

      const { currentIndex: toIndex } = event;
      const toParent = event.container.data;
      toParent.splice(toIndex, 0, fromData);
      return;
    }

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
