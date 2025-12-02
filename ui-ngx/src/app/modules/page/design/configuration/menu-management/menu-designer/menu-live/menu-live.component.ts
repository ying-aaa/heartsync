import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  EventEmitter,
  HostBinding,
  HostListener,
  input,
  OnInit,
  Output,
  output,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MenuDesignerService } from '../menu-deisgner.sevice';
import { deepClone, generateUUID } from '@src/app/core/utils';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'hs-menu-live',
  templateUrl: './menu-live.component.html',
  imports: [CdkDropList, CdkDrag, MatIcon, MatDivider],
})
export class MenuLiveComponent implements OnInit {
  @ViewChild(CdkDropList) dropList!: CdkDropList;
  // 向父元素输出
  @Output() onDrop = new EventEmitter<any>();

  parentNode = input<any>();
  nodes = input<any>();
  connectedTo = input<string[]>([]);
  // 层级
  level = input<number>(0);

  isDragging = computed(() => this.menuDeSignerService.isDragging());

  selectedNode = computed(() => this.menuDeSignerService.selectedNode());

  constructor(private menuDeSignerService: MenuDesignerService) {}

  @HostBinding('style.margin-left')
  get isTopLayer(): string {
    return this.level() ? '20px' : '0';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.menuDeSignerService.onMouseMove(event);
  }

  toggleDragging(isDragging: boolean): void {
    this.menuDeSignerService.toggleDragging(isDragging);
  }

  // 选择菜单事件
  selectNode(node: any) {
    this.menuDeSignerService.selectNode(node);
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
    const fromData = deepClone(event.item.data);

    const formParentData = event.previousContainer.data;
    const toParentData = event.container.data;
    const formIndex = event.previousIndex;
    const toIndex = event.currentIndex;

    if (fromData) {
      const assignId = (data: any) => {
        data.id = data.id || generateUUID();
        if (data.children) {
          data.children.forEach(assignId);
        }
      };
      assignId(fromData);

      toParentData.splice(toIndex, 0, fromData);

      this.menuDeSignerService.selectNode(fromData);
      return this.onDrop.emit();
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(toParentData, formIndex, toIndex);
    } else {
      transferArrayItem(formParentData, toParentData, formIndex, toIndex);
    }

    this.onDrop.emit();
  }

  ngOnInit() {}
}
