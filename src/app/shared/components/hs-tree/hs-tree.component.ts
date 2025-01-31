

import { AfterViewInit, Component, ElementRef, Renderer2, viewChild, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure, IEventsType } from '../../models/system.model';
import { BehaviorSubject, Observer, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { deepClone, getRecursivePosition } from '@src/app/core/utils';

const TREE_DATA: ICatalogStructure[] = [
  {
    name: 'Fruit',
    key: Math.floor(Math.random() * 1e10),
    children: [{
      name: 'Apple',
      key: Math.floor(Math.random() * 1e10)
    }, {
      name: 'Banana',
      key: Math.floor(Math.random() * 1e10)
    }, {
      name: 'Fruit loops',
      key: Math.floor(Math.random() * 1e10)
    }],
  },
  {
    name: 'Vegetables',
    key: Math.floor(Math.random() * 1e10),
    children: [
      {
        name: 'Green',
        key: Math.floor(Math.random() * 1e10),
        children: [{
          name: 'Broccoli',
          key: Math.floor(Math.random() * 1e10)
        }, {
          name: 'Brussels sprouts',
          key: Math.floor(Math.random() * 1e10),
          children: [
            {
              name: 'Green',
              key: Math.floor(Math.random() * 1e10),
              children: [{
                name: 'Broccoli',
                key: Math.floor(Math.random() * 1e10)
              }, {
                name: 'Brussels sprouts',
                key: Math.floor(Math.random() * 1e10)
              }],
            }]
        }],
      },
      {
        name: 'Orange',
        key: Math.floor(Math.random() * 1e10),
        children: [{
          name: 'Pumpkins',
          key: Math.floor(Math.random() * 1e10)
        }, {
          name: 'Carrots',
          key: Math.floor(Math.random() * 1e10)
        }],
      },
    ],
  },
];

class CustomDragCatalog {
  TreeEl!: HTMLElement;
  LineEl!: HTMLElement;

  entityEl!: HTMLElement | null;
  entityListEl: HTMLElement[] = [];
  parentEl!: HTMLElement | null;

  treeThis!: HsTreeComponent;

  event = new Map<HTMLElement, {
    [key in IEventsType]?: Function;
  }>();

  isMove$ = new BehaviorSubject(false);
  isCompile = false;

  keyboardEvent: KeyboardEvent | undefined;

  subscribetions: Subscription[] = [];

  dragComplete$ = new Subject();

  constructor(el: HTMLElement, treeThis: HsTreeComponent) {
    this.TreeEl = el;
    this.treeThis = treeThis;
    this.generataLine();
    this.init();
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
        this.treeThis.renderer.setStyle(this.LineEl, 'display', 'block');
      };
      if (!value) {
        this.treeThis.renderer.removeStyle(this.TreeEl, 'cursor');
        this.treeThis.renderer.setStyle(this.LineEl, "display", "none");
      };
    })
    this.subscribetions.push(sub);
  }

  generataLine() {
    this.LineEl = this.treeThis.renderer.createElement('div');
    this.treeThis.renderer.appendChild(document.body, this.LineEl);
    this.treeThis.renderer.setStyle(this.LineEl, 'width', 'fil-content');
    this.treeThis.renderer.setStyle(this.LineEl, 'font-size', '16px');
    this.treeThis.renderer.setStyle(this.LineEl, 'position', 'absolute');
    this.treeThis.renderer.setStyle(this.LineEl, 'top', '0');
    this.treeThis.renderer.setStyle(this.LineEl, 'left', '0');
    this.treeThis.renderer.setStyle(this.LineEl, 'padding', '6px');
    this.treeThis.renderer.setStyle(this.LineEl, 'background-color', '#8b8b8b');
    this.treeThis.renderer.setStyle(this.LineEl, 'border-radius', '8px');
    this.treeThis.renderer.setStyle(this.LineEl, 'opacity', '.8');
    this.treeThis.renderer.setStyle(this.LineEl, "display", "none");
  }

  downNodeLogic(e: MouseEvent) {
    e.preventDefault();
    // @ts-ignore
    let currentElement = e.target as HTMLElement;
    while (currentElement) {
      if (currentElement.tagName.toLowerCase() === 'cdk-nested-tree-node') {
        this.entityEl = currentElement;
        this.entityListEl.push(this.entityEl);
        const text = this.entityEl.querySelector("p")!;
        this.treeThis.renderer.setProperty(this.LineEl, 'innerText', text.textContent);
        break;
      }
      currentElement = currentElement.parentElement as HTMLElement;
    }
  }

  moveNodeLogic(e: MouseEvent) {
    if (!this.entityEl) return;
    // 触发拖拽的鼠标样式
    !this.isMove$.value && this.isMove$.next(true);
    let entityFolderEl = this.entityEl;
    while (entityFolderEl) {
      if (entityFolderEl.getAttribute("aria-folder")) break;
      entityFolderEl = entityFolderEl!.parentElement as HTMLElement;
    }

    // 拖拽跟随
    this.treeThis.renderer.setStyle(
      this.LineEl, 'transform',
      `translateX(${e.clientX + 15}px) translateY(${e.clientY + 5}px)`
    );

    // 做清除使用
    const parentEl = this.parentEl;
    this.parentEl = e.target as HTMLElement;
    while (this.parentEl) {
      if (this.parentEl.getAttribute("aria-folder")) {
        /**
         * 三种不能移动的情况
         * 1、不能向非目录移入
         * 2、不能往当前已在父级目录重复移入
         * 3、不能往子孙级目录移入
         * */
        if (
          entityFolderEl === this.parentEl
          || entityFolderEl.parentElement === this.parentEl
          || entityFolderEl.contains(this.parentEl)
        ) {
          parentEl && this.treeThis.renderer.removeStyle(parentEl, "background-color");
          // not compile
          return;
        };
        this.isCompile = true;
        parentEl && this.treeThis.renderer.removeStyle(parentEl, "background-color");
        this.treeThis.renderer.setStyle(this.parentEl, "background-color", "#8b8b8b4d");
        this.treeThis.renderer.setStyle(this.parentEl, "border-radius", "8px");
        break;
      } else {
        this.parentEl = this.parentEl!.parentElement as HTMLElement;
      }
    }
  }

  upNodeLogic(e: MouseEvent) {
    if (!this.entityEl) return;
    this.parentEl && this.treeThis.renderer.removeStyle(this.parentEl, "background-color");

    // 移入操作生成后释放空间，供下次评判
    this.isCompile && this.dragComplete$.next({
      entityList: this.entityListEl.map(el => el.getAttribute("aria-key")),
      parent: this.parentEl?.getAttribute("aria-key")
    })
    this.isCompile = false;

    this.isMove$.next(false);
    this.entityEl = null;
  }

  keydownLogic(e: KeyboardEvent) {
    this.keyboardEvent = e;
    if (e.ctrlKey && e.key === "a") {
      e.preventDefault();
      this.treeThis.renderer.setAttribute(this.treeThis.activeEl()!.parentElement, "class", "active-el");
      // @ts-ignore
      this.entityListEl = Array.from(this.treeThis.activeEl()!.parentElement?.children) as HTMLElement[];
    }
  }

  keyUpLogic(e: KeyboardEvent) {
    this.keyboardEvent = e;
  }

  clickNode(el: HTMLElement) {
    // 按住 Ctrl 键并点击节点, 进行多选和取消选择
    if (this.entityListEl.includes(el)) {
      this.entityListEl = this.entityListEl.filter(item => item !== el);
    } else {
      this.entityListEl.push(el);
    }
  }

  destroy() {
    this.subscribetions.forEach(sub => sub.unsubscribe());
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
  imports: [CommonModule, CdkTreeModule, MatButtonModule, MatIconModule, MatRippleModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HsTreeComponent implements AfterViewInit, OnDestroy {
  HsTree = viewChild<ElementRef>("HsTree");
  dragCatalog: CustomDragCatalog | null = null;
  treeData$ = new BehaviorSubject<ICatalogStructure[]>(TREE_DATA);

  treeControl = new NestedTreeControl<ICatalogStructure>(node => node.children);
  dataSource = new ArrayDataSource(this.treeData$);

  activeEl = signal<HTMLElement | null>(null);
  activeKey = computed(() => +this.activeEl()?.getAttribute("aria-key")!);
  hasActive = (node: ICatalogStructure) => {
    return !!this.dragCatalog?.entityListEl?.some(item => item.getAttribute("aria-key") == node.key);
  }

  hasChild = (_: number, node: ICatalogStructure) => !!node.children && node.children.length > 0;

  constructor(
    public renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) { }

  clickNode(e: Event) {
    e.stopPropagation();
    this.activeEl() && this.renderer.removeAttribute(this.activeEl()!.parentElement, "class");
    let targetNode = e.target as HTMLElement;
    while (!targetNode?.getAttribute("aria-key")) {
      targetNode = targetNode!.parentElement as HTMLElement

      if (targetNode?.getAttribute("aria-key")) {
        // 如果非按着ctrl键的点击
        if (!this.dragCatalog?.keyboardEvent?.ctrlKey) {
          this.dragCatalog!.entityListEl = [];
          this.activeEl.set(targetNode);
        } else {
          // 多选
          !this.dragCatalog.entityListEl.length && this.activeEl() && this.dragCatalog!.clickNode(this.activeEl() as HTMLElement);
          this.dragCatalog!.clickNode(targetNode);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // @ts-ignore 
    const cdkTreeRef = this.HsTree()._elementRef.nativeElement;
    this.dragCatalog = new CustomDragCatalog(cdkTreeRef, this);
    this.dragCatalog.dragComplete$.subscribe((res: any) => {
      const entityListValue = res.entityList
        .map((key: number) => getRecursivePosition(this.treeData$.value, key)?.value)
        .filter(Boolean);
      const mainValue = getRecursivePosition(this.treeData$.value, res.parent)?.offset;
      const treeData = deepClone(this.treeData$.value);

      // 通过堆内存的数据引用能力进行查询和操作
      const location = mainValue?.reduce((res, ori) => res + `[${ori}].children`, 'return treeData');
      const resData = new Function("treeData", location as string)(treeData);
      resData.push(...entityListValue);
      this.treeData$.next(treeData);

      this.dragCatalog!.entityListEl = [];
      this.cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.dragCatalog?.destroy();
  }
}



