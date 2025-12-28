import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  inject,
  model,
  signal,
} from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { IAnyPropObj } from '@src/app/shared/models/common-component';
import { HsLoadingComponent } from '@shared/components/hs-loading/hs-loading.component';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';

export class DynamicFlatNode {
  constructor(
    public item: IAnyPropObj,
    public level = 1,
    public expandable = false,
    public isLoading = signal(false),
  ) {}
}

@Injectable()
export class DynamicDatabase {
  dataMap = new Map<string, IAnyPropObj[]>();

  constructor(private authHttpService: AuthHttpService) {}

  initialData(): Observable<DynamicFlatNode[]> {
    return this.loadNodeData().pipe(
      map((data) => data.map((name) => new DynamicFlatNode(name, 0, true))),
    );
  }

  getChildren(nodeId: string): IAnyPropObj[] | undefined {
    return this.dataMap.get(nodeId);
  }

  isExpandable(node: IAnyPropObj): boolean {
    return node['subGroupCount'];
  }

  loadNodeData(node?: DynamicFlatNode) {
    const nodeId = node?.item['id'];
    const request = nodeId
      ? this.authHttpService.getSubGroups(nodeId, {})
      : this.authHttpService.getGroups({});
    return request.pipe(tap((data) => this.dataMap.set(nodeId, data)));
  }
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  async toggleNode(node: DynamicFlatNode, expand: boolean) {
    if (node.isLoading()) return;

    let children = this._database.getChildren(node.item['id']);
    const index = this.data.indexOf(node);
    if (index < 0) return;

    node.isLoading.set(true);

    // 如果节点被展开
    if (expand) {
      // 之前没有展开添加过子节点的话
      if (!children) {
        children = await this._database.loadNodeData(node).toPromise();
      }
      if (children) {
        const nodes = children.map(
          (item) => new DynamicFlatNode(item, node.level + 1, this._database.isExpandable(item)),
        );
        this.data.splice(index + 1, 0, ...nodes);
      }
    } else {
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > node.level;
        i++, count++
      ) {}
      this.data.splice(index + 1, count);
    }

    this.dataChange.next(this.data);
    node.isLoading.set(false);
  }
}

@Component({
  selector: 'hs-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.less'],
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    HsLoadingComponent,
  ],
  providers: [DynamicDatabase],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentListComponent {
  activeGroup = model<IAnyPropObj | null>(null);

  constructor() {
    const database = inject(DynamicDatabase);

    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    database.initialData().subscribe((data) => {
      this.dataSource.data = data;
      if (data.length > 0) {
        this.selectNode(data[0].item);
        // 展开第一层
        this.treeControl.expand(data[0]);
      }
    });
  }

  // 选择部门节点
  selectNode(node: IAnyPropObj) {
    this.activeGroup.set(node);
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}
