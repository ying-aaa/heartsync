import { AfterViewInit, Component, input, viewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule, CdkTree, CdkTreeNodeDef, NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ICatalogStructure } from '../../models/system.model';
const TREE_DATA: ICatalogStructure[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];


@Component({
  selector: 'hs-tree',
  styleUrl: './hs-tree.component.less',
  templateUrl: './hs-tree.component.html',
  imports: [CdkTreeModule, MatButtonModule, MatIconModule],
})
export class HsTreeComponent {
  treeControl = new NestedTreeControl<ICatalogStructure>(node => node.children);
  dataSource = new ArrayDataSource(TREE_DATA);

  hasChild = (_: number, node: ICatalogStructure) => !!node.children && node.children.length > 0;
}
