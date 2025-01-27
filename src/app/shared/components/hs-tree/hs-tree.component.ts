

import { AfterViewInit, Component, ElementRef, Renderer2, viewChild, OnDestroy } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure } from '../../models/system.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

const TREE_DATA: ICatalogStructure[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

class CustomDragCatalog {
  TreeEl!: HTMLElement;
  LineEl!: HTMLElement;

  entityEl!: HTMLElement | null;
  parentEl!: HTMLElement | null;

  treeThis!: HsTreeComponent;

  event: any = {};
  isMove = new BehaviorSubject(false);

  subscribetions: Subscription[] = [];

  constructor(el: HTMLElement, treeThis: HsTreeComponent) {
    this.TreeEl = el;
    this.treeThis = treeThis;
    this.generataLine();
    this.init();
  }

  init() {
    this.event = {
      downNodeLogic: this.downNodeLogic.bind(this),
      moveNodeLogic: this.moveNodeLogic.bind(this),
      upNodeLogic: this.upNodeLogic.bind(this),
    }
    this.TreeEl.addEventListener("mousedown", this.event.downNodeLogic);
    document.addEventListener("mousemove", this.event.moveNodeLogic);
    document.addEventListener("mouseup", this.event.upNodeLogic);
    const sub = this.isMove.subscribe((value) => {
      if (value) {
        this.treeThis.renderer.setStyle(this.TreeEl, 'cursor', 'move');
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
        const text = this.entityEl.querySelector("p")!;
        this.treeThis.renderer.setProperty(this.LineEl, 'innerText', text.textContent);
        break;
      }
      currentElement = currentElement.parentElement as HTMLElement;
    }
  }

  moveNodeLogic(e: MouseEvent) {
    if (!this.entityEl) return;
    !this.isMove.value && this.isMove.next(true);
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
          || entityFolderEl.parentElement?.parentElement === this.parentEl
          || entityFolderEl.contains(this.parentEl)
        ) {
          parentEl && this.treeThis.renderer.removeStyle(parentEl, "background-color");
          return;
        };
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
    this.isMove.next(false);
    this.entityEl = null;
  }

  destroy() {
    this.subscribetions.forEach(sub => sub.unsubscribe());
    this.TreeEl.removeEventListener("mousedown", this.event.downNodeLogic);
    document.removeEventListener("mousemove", this.event.moveNodeLogic);
    document.removeEventListener("mouseup", this.event.upNodeLogic);
  }
}

@Component({
  selector: 'hs-tree',
  styleUrl: './hs-tree.component.less',
  templateUrl: './hs-tree.component.html',
  imports: [CommonModule, CdkTreeModule, MatButtonModule, MatIconModule, MatRippleModule],
})
export class HsTreeComponent implements AfterViewInit, OnDestroy {
  HsTree = viewChild<ElementRef>("HsTree");
  dragCatalog: CustomDragCatalog | null = null;
  treeData = new BehaviorSubject<ICatalogStructure[]>(TREE_DATA.map(item => ({ key: Math.floor(Math.random() * 1e10), ...item })));

  treeControl = new NestedTreeControl<ICatalogStructure>(node => node.children);
  dataSource = new ArrayDataSource(this.treeData);

  hasChild = (_: number, node: ICatalogStructure) => !!node.children && node.children.length > 0;

  constructor(
    public renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    // @ts-ignore 
    const cdkTreeRef = this.HsTree()._elementRef.nativeElement;
    this.dragCatalog = new CustomDragCatalog(cdkTreeRef, this);
  }

  ngOnDestroy(): void {
    this.dragCatalog?.destroy();
  }
}



