

import { AfterViewInit, Component, effect, ElementRef, Renderer2, signal, viewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule, CdkTree, CdkTreeNodeDef, NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure } from '../../models/system.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { CdkDrag, CdkDragPreview } from '@angular/cdk/drag-drop';
import { isSameObj } from '@src/app/core/utils';
import { CommonModule } from '@angular/common';


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

  isMove = new BehaviorSubject(false);

  constructor(el: HTMLElement, treeThis: HsTreeComponent) {
    this.TreeEl = el;
    this.treeThis = treeThis;
    this.generataLine();
    this.init();

  }

  init() {
    this.TreeEl.addEventListener("mousedown", this.downNodeLogic.bind(this));
    this.TreeEl.addEventListener("mousemove", this.moveNodeLogic.bind(this));
    this.TreeEl.addEventListener("mouseup", this.upNodeLogic.bind(this));
    this.isMove.subscribe((value) => {
      if (value) {
        this.treeThis.renderer.setStyle(this.TreeEl, 'cursor', 'move')
      };
      if (!value) {
        this.treeThis.renderer.removeStyle(this.TreeEl, 'cursor')
      };
    })
  }

  generataLine() {
    this.LineEl = this.treeThis.renderer.createElement('div');
    this.treeThis.renderer.appendChild(this.TreeEl, this.LineEl);
    this.treeThis.renderer.setStyle(this.LineEl, 'width', '100%');
    this.treeThis.renderer.setStyle(this.LineEl, 'height', '1px');
    this.treeThis.renderer.setStyle(this.LineEl, 'backgroundColor', 'blue');
  }

  downNodeLogic(e: MouseEvent) {
    e.preventDefault();
    // @ts-ignore
    let currentElement = e.target as HTMLElement;
    while (currentElement) {
      if (currentElement.tagName.toLowerCase() === 'cdk-nested-tree-node') {
        this.entityEl = currentElement;
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
        this.treeThis.renderer.setStyle(this.parentEl, "background-color", "red");
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

  }
}

@Component({
  selector: 'hs-tree',
  styleUrl: './hs-tree.component.less',
  templateUrl: './hs-tree.component.html',
  imports: [CommonModule, CdkTreeModule, MatButtonModule, MatIconModule],
})
export class HsTreeComponent implements AfterViewInit {
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
}



