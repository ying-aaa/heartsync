import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  HostBinding,
  input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MenuDesignerService } from '../menu-deisgner.sevice';
import { camelToKebabCase, deepClone, generateUUID } from '@src/app/core/utils';
import { MatDivider } from '@angular/material/divider';
import { HsIconComponent } from '@src/app/shared/components/hs-icon/hs-icon.component';
import { MenuManagementService } from '../../menu-management.sevice';
import { IEventsType } from '@src/app/shared/models/public-api';
import { CommonModule } from '@angular/common';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';

@Component({
  selector: 'hs-menu-live',
  templateUrl: './menu-live.component.html',
  imports: [
    CdkDropList,
    CdkDrag,
    MatIcon,
    MatDivider,
    HsIconComponent,
    CommonModule,
    ConcatUnitsPipe,
  ],
})
export class MenuLiveComponent implements OnInit, AfterViewInit, OnDestroy {
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

  isRoot = computed(() => this.level() === 0);

  styleTag: any;

  parentDefaultStyle = computed(() => {
    // const globalMenuConfig = this.menuManagementService.globalMenuConfig();
    // const defaultStyle = globalMenuConfig.parent?.default || {};
    return {};
  });

  childrenDefaultStyle = computed(() => {
    // const globalMenuConfig = this.menuManagementService.globalMenuConfig();
    // const defaultStyle = globalMenuConfig.children?.default || {};
    return {};
  });

  event = new Map<
    HTMLElement,
    {
      [key in IEventsType]?: Function;
    }
  >();

  concatUnitsPipe = new ConcatUnitsPipe();

  constructor(
    private menuDeSignerService: MenuDesignerService,
    private menuManagementService: MenuManagementService,
    private rootEl: ElementRef,
  ) {
    effect(() => {
      this.drawCss();
    });
  }

  transform(value: any): string {
    let styleStr = '';

    Object.keys(value).forEach((key) => {
      const unitKey = `${key}Units`;
      // 将驼峰转为-线+大写的第一个字母，比如backgroundColor转为background-color
      // if (!key.endsWith('Units')) {
      //   key = camelToKebabCase(key);
      // }
      const hyphenKey = camelToKebabCase(key);
      if (value.hasOwnProperty(unitKey)) {
        styleStr += `${hyphenKey}: ${value[key]}${value[unitKey]};`;
      } else if (!key.endsWith('Units')) {
        styleStr += `${hyphenKey}: ${value[key]};`;
      }
    });
    return styleStr;
  }

  drawCss() {
    const globalMenuConfig = this.menuManagementService.globalMenuConfig();
    const childrenDefault = this.transform(globalMenuConfig.children?.default || {});
    const childrenHover = this.transform(globalMenuConfig.children?.hover || {});
    const childrenActive = this.transform(globalMenuConfig.children?.active || {});
    const parentDefault = this.transform(globalMenuConfig.parent?.default || {});
    const parentHover = this.transform(globalMenuConfig.parent?.hover || {});
    const parentActive = this.transform(globalMenuConfig.parent?.active || {});

    this.styleTag = this.styleTag || document.querySelector('style[id="menu-dynamic-style"]');

    if (!this.styleTag) {
      this.styleTag = document.createElement('style');
      this.styleTag.id = 'menu-dynamic-style';
      document.head.appendChild(this.styleTag);
    }

    this.styleTag.textContent = `
      .hs-menu-item-parent {
        ${parentDefault}
      }
      .hs-menu-item-parent:hover {
        ${parentHover}
      }
      .hs-menu-item-parent.active {
        ${parentActive}
      }
      .hs-menu-item-children {
        ${childrenDefault}
      }
      .hs-menu-item-children:hover {
        ${childrenHover}
      }
      .hs-menu-item-children.active {
        ${childrenActive}
      }
    `;
  }

  initEvent() {
    if (this.isRoot()) {
      // 事件总线
      this.event.set(this.rootEl.nativeElement, {
        [IEventsType.MouseMove]: this.onMouseMove.bind(this),
      });

      for (const [el, evnets] of this.event) {
        for (const [eventName, eventFun] of Object.entries(evnets)) {
          // @ts-ignore
          el.addEventListener(eventName, eventFun);
        }
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    this.menuDeSignerService.onMouseMove(event);
  }

  @HostBinding('style.margin-left')
  get isTopLayer(): string {
    return this.level() ? '20px' : '0';
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

  ngAfterViewInit(): void {
    this.initEvent();
  }

  ngOnDestroy(): void {
    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.removeEventListener(eventName, eventFun);
      }
    }
  }
}
