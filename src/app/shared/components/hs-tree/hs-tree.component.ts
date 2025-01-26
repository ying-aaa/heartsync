import { AfterViewInit, Component, input, viewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule, CdkTree, CdkTreeNodeDef } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure } from '../../models/system.model';
import { BehaviorSubject } from 'rxjs';
import Sortable from 'sortablejs';

const TREE_DATA: ICatalogStructure[] = [
  {
    name: 'Fruit',
    expandable: true,
    level: 0,
  },
  {
    name: 'Apple',
    expandable: true,
    level: 1,
  },
  {
    name: 'Banana',
    expandable: false,
    level: 1,
  },
  {
    name: 'Fruit loops',
    expandable: false,
    level: 1,
  },
  {
    name: 'Vegetables',
    expandable: true,
    level: 0,
  },
  {
    name: 'Green',
    expandable: true,
    level: 1,
  },
  {
    name: 'Broccoli',
    expandable: false,
    level: 2,
  },
  {
    name: 'Brussels sprouts',
    expandable: false,
    level: 2,
  },
  {
    name: 'Orange',
    expandable: true,
    level: 1,
  },
  {
    name: 'Pumpkins',
    expandable: false,
    level: 2,
  },
  {
    name: 'Carrots',
    expandable: false,
    level: 2,
  },
];

// class CustomTreeDataSource implements  ArrayDataSource<ICatalogStructure> {
//   data = BehaviorSubject
//   connect(): Observable<readonly ICatalogStructure[]> {
//     throw new Error('Method not implemented.');
//   }
//   disconnect(): void {
//     throw new Error('Method not implemented.');
//   }

// }

/** Flat node with expandable and level information */
@Component({
  selector: 'hs-tree',
  styleUrl: './hs-tree.component.less',
  templateUrl: './hs-tree.component.html',
  imports: [CdkTreeModule, MatButtonModule, MatIconModule],
})
export class HsTreeComponent implements AfterViewInit {
  treeControl = new FlatTreeControl<ICatalogStructure>(
    node => node.level,
    node => node.expandable,
  );

  treeData = new BehaviorSubject<ICatalogStructure[]>([]);

  dataSource = new ArrayDataSource(this.treeData);

  hasChild = (_: number, node: ICatalogStructure) => node.expandable;

  constructor() {
    setTimeout(() => {
      this.treeData.next(TREE_DATA);
    }, 1000);
  }
  ngAfterViewInit(): void {
    const hsTree: HTMLElement = document.querySelector('#hs-tree')!;
    new Sortable(hsTree, {
      ghostClass: 'blue-background-class',
      animation: 150
    });
  }

  getParentNode(node: ICatalogStructure) {
    const TREE_DATA = this.treeData.value;
    const nodeIndex = TREE_DATA.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (TREE_DATA[i].level === node.level - 1) {
        return TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: ICatalogStructure) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }
}
