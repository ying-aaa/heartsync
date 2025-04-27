import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  viewChild,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure, IEventsType } from '../../models/system.model';
import { BehaviorSubject, Observer, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import {
  deepClone,
  getRecursivePosition,
  handlerNgElStyle,
} from '@src/app/core/utils';

function getNodeEl(el: HTMLElement, attr = 'aria-key'): HTMLElement | null {
  let node = el;
  while (node) {
    if (node.getAttribute(attr)) return node;
    node = node.parentElement as HTMLElement;
  }
  return null;
}

const TREE_DATA: ICatalogStructure[] = [
  {
    name: 'Fruit',
    key: Math.floor(Math.random() * 1e10),
    children: [
      {
        name: 'Apple',
        key: Math.floor(Math.random() * 1e10),
      },
      {
        name: 'Banana',
        key: Math.floor(Math.random() * 1e10),
      },
      {
        name: 'Fruit loops',
        key: Math.floor(Math.random() * 1e10),
      },
    ],
  },
  {
    name: 'Vegetables',
    key: Math.floor(Math.random() * 1e10),
    children: [
      {
        name: 'Green',
        key: Math.floor(Math.random() * 1e10),
        children: [
          {
            name: 'Broccoli',
            key: Math.floor(Math.random() * 1e10),
          },
          {
            name: 'Brussels sprouts',
            key: Math.floor(Math.random() * 1e10),
            children: [
              {
                name: 'Green',
                key: Math.floor(Math.random() * 1e10),
                children: [
                  {
                    name: 'Broccoli',
                    key: Math.floor(Math.random() * 1e10),
                  },
                  {
                    name: 'Brussels sprouts',
                    key: Math.floor(Math.random() * 1e10),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Orange',
        key: Math.floor(Math.random() * 1e10),
        children: [
          {
            name: 'Pumpkins',
            key: Math.floor(Math.random() * 1e10),
          },
          {
            name: 'Carrots',
            key: Math.floor(Math.random() * 1e10),
          },
        ],
      },
    ],
  },
];

class CustomDragCatalog {
  // 事件委托
  TreeEl!: HTMLElement;
  // 跟随元素
  followEl!: HTMLElement;

  // 实体
  entityEl!: HTMLElement | null;
  // 实体列表
  entityListEl: HTMLElement[] = [];
  // 最终移入的目录
  finalEl!: HTMLElement | null;

  treeThis!: HsTreeComponent;

  // 元素事件
  event = new Map<
    HTMLElement,
    {
      [key in IEventsType]?: Function;
    }
  >();

  // 是否在拖动过程中
  isMove$ = new BehaviorSubject(false);
  // 是否可以根据已拖动的进行操作
  isCompile = false;

  // 当前键盘按下情况
  keyboardEvent: KeyboardEvent | undefined;

  subscribetions: Subscription[] = [];

  // 通知进行拖动
  dragComplete$ = new Subject();

  constructor(el: HTMLElement, treeThis: HsTreeComponent) {
    this.TreeEl = el;
    this.treeThis = treeThis;
    this.generataFollow();
    this.init();
  }

  isEntityEl() {
    return this.entityListEl.some(
      (el) => el === this.entityEl || el.contains(this.entityEl),
    );
  }

  init() {
    // 事件总线
    this.event
      .set(this.TreeEl, {
        // 鼠标按下事件
        [IEventsType.MouseDown]: this.downNodeLogic.bind(this),
      })
      // @ts-ignore
      .set(document, {
        [IEventsType.MouseMove]: this.moveNodeLogic.bind(this),
        [IEventsType.MouseUp]: this.upNodeLogic.bind(this),
        [IEventsType.KeyDown]: this.keydownLogic.bind(this),
        [IEventsType.KeyUp]: this.keyUpLogic.bind(this),
      });

    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.addEventListener(eventName, eventFun);
      }
    }

    // 观察者总线
    const sub = this.isMove$.subscribe((value) => {
      if (value) {
        this.treeThis.renderer.setStyle(this.TreeEl, 'cursor', 'alias');
        this.treeThis.renderer.setStyle(this.followEl, 'display', 'block');
      }
      if (!value) {
        this.treeThis.renderer.removeStyle(this.TreeEl, 'cursor');
        this.treeThis.renderer.setStyle(this.followEl, 'display', 'none');
      }
    });
    this.subscribetions.push(sub);
  }

  generataFollow() {
    this.followEl = this.treeThis.renderer.createElement('div');
    this.treeThis.renderer.appendChild(document.body, this.followEl);
    handlerNgElStyle(this.treeThis.renderer, this.followEl, {
      width: 'fil-content',
      'font-size': '16px',
      position: 'absolute',
      top: '0',
      left: '0',
      padding: '6px',
      'background-color': '#8b8b8b',
      'border-radius': '8px',
      opacity: '.8',
      display: 'none',
    });
  }

  downNodeLogic(e: MouseEvent) {
    e.preventDefault();
    this.entityEl = getNodeEl(e.target as HTMLElement);

    const text =
      this.isEntityEl() && this.entityListEl.length > 1
        ? this.entityListEl.length
        : this.entityEl!.querySelector('p')!.textContent;
    this.treeThis.renderer.setProperty(this.followEl, 'innerText', text);
  }

  moveNodeLogic(e: MouseEvent) {
    if (!this.entityEl) return;
    // 触发拖拽的鼠标样式
    !this.isMove$.value && this.isMove$.next(true);

    // 实体所在目录
    let entityFolderEl = getNodeEl(this.entityEl, 'aria-folder');

    // 拖拽跟随
    this.treeThis.renderer.setStyle(
      this.followEl,
      'transform',
      `translateX(${e.clientX + 15}px) translateY(${e.clientY + 5}px)`,
    );

    // 做清除使用
    const finalEl = this.finalEl;
    this.finalEl = getNodeEl(e.target as HTMLElement, 'aria-folder');
    /**
     * 三种不能移动的情况
     * 1、不能向非目录移入 2、不能往当前已在父级目录重复移入 3、不能往子孙级目录移入
     * */
    if (
      !this.finalEl ||
      entityFolderEl === this.finalEl ||
      entityFolderEl!.parentElement === this.finalEl ||
      entityFolderEl!.contains(this.finalEl)
    ) {
      finalEl &&
        this.treeThis.renderer.removeStyle(finalEl, 'background-color');
      // not compile
      return;
    }
    // can compile
    this.isCompile = true;
    finalEl && this.treeThis.renderer.removeStyle(finalEl, 'background-color');
    handlerNgElStyle(this.treeThis.renderer, this.finalEl, {
      'background-color': '#8b8b8b4d',
      'border-radius': '8px',
    });
  }

  upNodeLogic(e: MouseEvent) {
    if (!this.entityEl) return;
    this.finalEl &&
      this.treeThis.renderer.removeStyle(this.finalEl, 'background-color');

    // 移入操作生成后释放空间，供下次评判
    this.isCompile &&
      this.dragComplete$.next({
        entityList: this.isEntityEl()
          ? this.entityListEl.map((el) => el.getAttribute('aria-key'))
          : [this.entityEl.getAttribute('aria-key')],
        parent: this.finalEl?.getAttribute('aria-key'),
      });
    this.isCompile = false;

    this.isMove$.next(false);
    this.entityEl = null;
  }

  keydownLogic(e: KeyboardEvent) {
    this.keyboardEvent = e;
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      // @ts-ignore
      // [aria-expanded='true']
      this.setEntityListEl(
        this.treeThis
          .activeEl()!
          .parentElement?.querySelectorAll('cdk-nested-tree-node'),
      );
    }
  }

  keyUpLogic(e: KeyboardEvent) {
    this.keyboardEvent = e;
  }

  clickNode(el: HTMLElement) {
    // 按住 Ctrl 键并点击节点, 进行多选和取消选择
    if (this.entityListEl.includes(el)) {
      this.entityListEl = this.entityListEl.filter((item) => item !== el);
    } else {
      this.entityListEl.push(el);
    }
  }

  setEntityListEl(listEl: any): void {
    this.entityListEl = Array.from(listEl) as HTMLElement[];
  }

  destroy() {
    this.subscribetions.forEach((sub) => sub.unsubscribe());
    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.removeEventListener(eventName, eventFun);
      }
    }
  }
}

@Component({
  selector: 'hs-tree',
  styleUrl: './hs-tree.component.less',
  templateUrl: './hs-tree.component.html',
  imports: [
    CommonModule,
    CdkTreeModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HsTreeComponent implements AfterViewInit, OnDestroy {
  HsTree = viewChild<ElementRef>('HsTree');
  dragCatalog: CustomDragCatalog | null = null;
  treeData$ = new BehaviorSubject<ICatalogStructure[]>(TREE_DATA);

  treeControl = new NestedTreeControl<ICatalogStructure>(
    (node) => node.children,
  );
  dataSource = new ArrayDataSource(this.treeData$);

  activeEl = signal<HTMLElement | null>(null);
  activeKey = computed(() => +this.activeEl()?.getAttribute('aria-key')!);

  getRecursivePosition(node: ICatalogStructure): number {
    return (
      getRecursivePosition<ICatalogStructure>(this.treeData$.value, node.key, [
        'children',
        'key',
      ])?.offset.length! - 1
    );
  }
  hasActive = (node: ICatalogStructure) => {
    return !!this.dragCatalog?.entityListEl?.some(
      (item) => item.getAttribute('aria-key') == node.key,
    );
  };

  hasChild = (_: number, node: ICatalogStructure) =>
    !!node.children && node.children.length > 0;

  constructor(public renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  clickNode(e: Event) {
    e.stopPropagation();
    try {
      this.activeEl() &&
        this.renderer?.removeAttribute(this.activeEl()!.parentElement, 'class');
    } catch (error) {}
    let targetNode = getNodeEl(e.target as HTMLElement);

    if (!this.dragCatalog?.keyboardEvent?.ctrlKey) {
      this.activeEl.set(targetNode);
      this.dragCatalog!.setEntityListEl([targetNode]);
    } else {
      this.activeEl() === targetNode && this.activeEl.set(null);
      this.dragCatalog.clickNode(targetNode as HTMLElement);
    }
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    const cdkTreeRef = this.HsTree()._elementRef.nativeElement;
    this.dragCatalog = new CustomDragCatalog(cdkTreeRef, this);
    this.dragCatalog.dragComplete$.subscribe((res: any) => {
      const entityListValue = res.entityList
        .map(
          (key: number) =>
            getRecursivePosition<ICatalogStructure>(this.treeData$.value, key, [
              'children',
              'key',
            ])?.value,
        )
        .filter(Boolean);
      const mainValue = getRecursivePosition<ICatalogStructure>(
        this.treeData$.value,
        res.parent,
        ['children', 'key'],
      )?.offset;
      const treeData = deepClone(this.treeData$.value);

      // 通过堆内存的数据引用能力进行查询和操作
      const location = mainValue?.reduce(
        (res, ori) => res + `[${ori}].children`,
        'return treeData',
      );
      const resData = new Function('treeData', location as string)(treeData);
      resData.push(
        ...entityListValue.map((item: ICatalogStructure) => ({
          ...item,
          key: Math.floor(Math.random() * 1e10),
        })),
      );
      this.treeData$.next(treeData);

      this.dragCatalog!.setEntityListEl([]);
      this.dragCatalog!.entityEl = null;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.dragCatalog?.destroy();
  }
}
