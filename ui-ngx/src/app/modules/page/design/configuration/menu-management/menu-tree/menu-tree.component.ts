import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IMenuNode, IMenuType } from '@shared/models/app-menu.model';
import { HsInlineEditorModule } from '@shared/components/hs-inline-editor/inline-editor.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { generateUUID, getParamFromRoute, handlerNgElStyle } from '@src/app/core/utils';
import { MenuHttpService } from '@src/app/core/http/menu.service';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatMenuModule } from '@angular/material/menu';
import { TreeSelectComponent } from '@src/app/shared/components/hs-tree-select/hs-tree-select.component';
import { FileTreeService } from '@src/app/core/http/file-tree.service';
import { BehaviorSubject, delay, Subject, Subscription } from 'rxjs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MenuManagementService } from '../menu-management.sevice';
import { IEventsType } from '@src/app/shared/models/public-api';
import { AsyncPipe } from '@angular/common';

function getDraggableEl(el: HTMLElement): HTMLElement | null {
  let node = el;
  while (node) {
    if (node.getAttribute('aria-draggable') === 'true') return node;
    node = node.parentElement as HTMLElement;
  }
  return null;
}

function getFolderEl(el: HTMLElement): { folderEl: HTMLElement; toIndex: number } | null {
  let toIndex = 0;
  const elLevel = +el.getAttribute('aria-level')!;
  if (!elLevel) return null;
  let node = el;
  while (node) {
    node = node.previousElementSibling as HTMLElement;
    // 获取当前元素的父元素，因为数据是平铺的，只需要找当前level的小一级
    if (+node?.getAttribute('aria-level')! === elLevel - 1) return { folderEl: node, toIndex };

    toIndex += 1;
  }
  return null;
}

class CustomDragTable {
  // 事件委托
  tableEl!: HTMLElement;

  // 跟随元素
  followEl!: HTMLElement;

  // 表格组件实例
  tableThis!: MenuTreeComponent;

  // 实体元素
  entityEl: HTMLElement | null = null;

  // 实体元素层级
  entityLevel: number;

  // 实体所在目录
  entityFolderEl: HTMLElement | null = null;

  // 划过的实体元素
  overEl: HTMLElement | null = null;

  // 是否移动
  isMove$ = new BehaviorSubject(false);

  // 最后落点位置
  lastDropInfo: {
    entityEl?: HTMLElement | null;
    folderEl: HTMLElement | null;
    toIndex: number | null;
  } = {
    entityEl: null,
    folderEl: null,
    toIndex: null,
  };
  // 发布
  lastDropInfo$ = new Subject<{
    entityEl?: HTMLElement | null;
    folderEl: HTMLElement | null;
    toIndex: number | null;
  }>();

  // 订阅者
  subscribetions: Subscription[] = [];

  event = new Map<
    HTMLElement,
    {
      [key in IEventsType]?: Function;
    }
  >();

  private renderer: Renderer2;

  constructor(el: HTMLElement, tableThis: MenuTreeComponent) {
    this.tableEl = el;
    this.tableThis = tableThis;
    this.renderer = tableThis.renderer;
    this.generataFollow();
    this.init();
  }

  generataFollow() {
    this.followEl = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, this.followEl);
    handlerNgElStyle(this.renderer, this.followEl, {
      width: '300px',
      height: '4px',
      'font-size': '16px',
      position: 'absolute',
      top: '0',
      left: '0',
      'background-color': '#3090b9',
      'border-radius': '8px',
      opacity: '.8',
      display: 'block',
      'z-index': '9999',
    });
  }

  init() {
    // 事件总线
    this.event
      .set(this.tableEl, {
        // 鼠标按下事件
        [IEventsType.MouseDown]: this.mouseDown.bind(this),
      })
      // @ts-ignore
      .set(document, {
        [IEventsType.MouseMove]: this.mouseMove.bind(this),
        [IEventsType.MouseUp]: this.mouseUp.bind(this),
      });

    for (const [el, evnets] of this.event) {
      for (const [eventName, eventFun] of Object.entries(evnets)) {
        // @ts-ignore
        el.addEventListener(eventName, eventFun);
      }
    }

    const sub = this.isMove$.subscribe((value) => {
      if (value) {
        this.renderer.setStyle(this.tableEl, 'cursor', 'alias');
        this.renderer.setStyle(this.followEl, 'display', 'block');
      }
      if (!value) {
        this.renderer.removeStyle(this.tableEl, 'cursor');
        this.renderer.setStyle(this.followEl, 'display', 'none');
      }
    });

    this.subscribetions.push(sub);
  }

  // 鼠标按下触发
  mouseDown(e: MouseEvent) {
    e.preventDefault();
    this.entityEl = getDraggableEl(e.target as HTMLElement);

    if (this.entityEl) {
      this.lastDropInfo.entityEl = this.entityEl;
      this.entityLevel = Number(this.entityEl.getAttribute('aria-level')!);
    }
  }

  // 鼠标按下移动
  mouseMove(e: MouseEvent) {
    e.preventDefault();

    this.lastDropInfo = {} as any;

    // 如果不是触发tr拖动
    if (!this.entityEl) return;

    const target = e.target as HTMLElement;

    // 划过的元素
    this.overEl = getDraggableEl(target);
    if (!this.overEl) return;
    // if (this.overEl === this.entityEl) return;

    const rect = this.overEl.getBoundingClientRect();
    const overLevel = Number(this.overEl.getAttribute('aria-level'));
    const overFolder = this.overEl.getAttribute('aria-folder') === 'true';
    // 目录可以多延伸一级
    let overLevelNum = overFolder ? overLevel + 1 : overLevel;

    const overNextEl = this.overEl.nextElementSibling;
    const overNextLevel = Number(overNextEl?.getAttribute('aria-level'));

    let levelMargin = overLevelNum * 32 + 44;

    const { left, bottom } = rect;
    const moveX = e.clientX - left;

    while (overLevelNum) {
      // 如果移动到了目录，而且目录下有子元素，则不能超过当前目录
      if (overFolder && overLevel === overNextLevel - 1) {
        // 等于当前父目录向后一级就终止
        if (overLevelNum === overLevel + 1) {
          this.lastDropInfo = {
            folderEl: this.overEl,
            toIndex: 0,
            entityEl: this.entityEl,
          };
          break;
        }
      }
      // 如果下一个元素和当前是平级，则不能向前移动
      if (overLevel === overNextLevel) {
        // 同级时终止
        if (overLevelNum === overLevel) {
          const res = getFolderEl(this.overEl) || ({} as any);

          // const toIndex = Array.from(folderEl).indexOf(this.overEl);
          this.lastDropInfo = { ...res, entityEl: this.entityEl };
          break;
        }
      }
      // 如果下一个元素是不是子集也不是同级，那么便是其他组的
      if (overLevel > overNextLevel) {
        // 最多到和下一级同级
        if (overLevelNum === overNextLevel) break;
      }

      if (moveX < levelMargin) {
        levelMargin -= 32;
        overLevelNum -= 1;
      } else {
        break;
      }
    }

    // 触发拖拽的鼠标样式
    !this.isMove$.value && this.isMove$.next(true);

    handlerNgElStyle(this.renderer, this.followEl, {
      marginLeft: levelMargin + 'px',
      transform: `translateX(${left}px) translateY(${bottom}px)`,
    });
  }

  // 鼠标按下抬起触发
  mouseUp(e: MouseEvent) {
    e.preventDefault();
    this.lastDropInfo$.next(this.lastDropInfo);
    // 触发拖拽的鼠标样式
    this.isMove$.next(false);
    this.entityEl = null;
    this.entityFolderEl = null;
    this.overEl = null;
  }
}

interface FlatIMenuNode extends IMenuNode {
  level: number;
  expandable: boolean;
  isExpanded: boolean;
}

@Component({
  selector: 'hs-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.less'],
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    HsInlineEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    HsSvgModule,
    MatChipsModule,
    MatInputModule,
    HsLoadingModule,
    MatTooltipModule,
    MatMenuModule,
    TreeSelectComponent,
    NgScrollbarModule,
    MatSelectModule,
    MatFormFieldModule,
    AsyncPipe,
  ],
})
export class MenuTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('MatTable', { read: ElementRef }) matTableElement!: ElementRef<HTMLTableElement>;

  IMenuType = IMenuType;
  appId: string = getParamFromRoute('appId', this.route)!;

  searchControl = new FormControl('');

  loadingStatus = false;

  displayedColumns: string[] = ['name', 'menuType', 'dashboardId', 'isFullscreen', 'actions'];

  clickedRows: IMenuNode | null = null;

  // 使用信号管理树数据
  menuData = this.menuManagementService.menuData;

  dashboardData = signal<IMenuNode[]>([]);

  // 节点展开状态管理（独立信号）
  expandedNodes = signal<Set<string>>(new Set());

  // 扁平节点计算（仅计算需要渲染的节点）
  flattenedNodes = computed(() => {
    const result: FlatIMenuNode[] = [];
    const expandedSet = this.expandedNodes();

    const processNode = (node: IMenuNode, level: number) => {
      const isExpanded = expandedSet.has(node.id);
      const expandable = !!(node.children && node.children.length > 0);

      result.push({
        ...node,
        level,
        expandable,
        isExpanded,
      });

      if (isExpanded && expandable && node.children) {
        node.children.forEach((child) => processNode(child, level + 1));
      }
    };

    this.menuData().forEach((node) => processNode(node, 0));
    return result;
  });

  customDragTable: CustomDragTable;

  constructor(
    private route: ActivatedRoute,
    private menuHttpService: MenuHttpService,
    private fileTreeService: FileTreeService,
    private menuManagementService: MenuManagementService,
    public renderer: Renderer2,
  ) {
    this.initMenuFilter();
  }

  // 根据nodeId查找节点并更新节点值
  changeNodeValue(nodeId: string, field: keyof IMenuNode, value: any) {
    let isChanged = false;
    let matchedNode: IMenuNode | undefined;
    const updateNodeValue = (nodes: IMenuNode[]): IMenuNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          isChanged = node[field] !== value;
          matchedNode = node;
          return { ...node, [field]: value };
        }
        if (node.children) {
          return { ...node, children: updateNodeValue(node.children) };
        }
        return node;
      });
    };
    this.menuData.update((currentData) => updateNodeValue(currentData));

    if (isChanged && matchedNode) {
      const updateData = { id: matchedNode.id, [field]: value } as IMenuNode;
      this.menuHttpService.updateMenu(matchedNode.id, updateData).subscribe((res) => {});
    }
  }

  initMenuFilter() {}

  collapseAll() {
    this.expandedNodes.set(new Set());
  }

  expandAll() {
    const allNodeIds = new Set<string>();
    const collectNodeIds = (nodes: IMenuNode[]) => {
      nodes.forEach((node) => {
        allNodeIds.add(node.id);
        if (node.children) {
          collectNodeIds(node.children);
        }
      });
    };
    collectNodeIds(this.menuData());
    this.expandedNodes.set(allNodeIds);
  }

  trackById(index: number, item: any): number {
    return index;
  }

  // 获取子节点（优化渲染）
  // getChildren(parent: FlatIMenuNode): FlatIMenuNode[] {
  //   const parentNode = this.findNode(parent.id);
  //   if (!parentNode || !parentNode.children) return [];

  //   return parentNode.children.map((child) => ({
  //     ...child,
  //     level: parent.level + 1,
  //     expandable: !!(child.children && child.children.length > 0),
  //     isExpanded: this.expandedNodes().has(child.id),
  //   }));
  // }

  // 查找节点（优化性能）
  private findNode(id: string, nodes?: IMenuNode[]): IMenuNode | null {
    const searchNodes = nodes || this.menuData();
    for (const node of searchNodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  addChildNode(type: IMenuType, node: any) {
    const newNode: IMenuNode = {
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node.id,
      isFullscreen: false,
      sort: 1,
      dashboardId: null,
    };

    const nodeOriginData = this.findNode(node.id)!;

    if (nodeOriginData.children) {
      nodeOriginData.children.push(newNode);
    } else {
      nodeOriginData.children = [newNode];
    }

    this.menuData.update((currentData) => [...currentData]);

    // 触发展开状态更新
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      newSet.add(node.id);
      return newSet;
    });

    this.menuHttpService.createMenu(newNode).subscribe((res) => {});
  }

  addSameNode(type: IMenuType, node: any) {
    const newNode: IMenuNode = {
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node && node.parentMenuId,
      isFullscreen: false,
      sort: 1,
      dashboardId: null,
    };

    const parentNode = this.findNode(node?.parentMenuId);

    if (parentNode) {
      if (parentNode.children) {
        parentNode.children.push(newNode);
      } else {
        parentNode.children = [newNode];
      }
      this.menuData.update((currentData) => [...currentData]);
    } else {
      this.menuData.update((currentData) => [...currentData, newNode]);
    }

    this.menuHttpService.createMenu(newNode).subscribe((res) => {});
  }

  deleteMenu(node: IMenuNode) {
    if (node.id === this.clickedRows?.id) this.clickedRows = null;

    const removeNodeRecursively = (nodes: IMenuNode[], id: string): IMenuNode[] => {
      return nodes
        .map((n) => {
          if (n.id === id) {
            return null; // 标记为删除
          }
          if (n.children) {
            n.children = removeNodeRecursively(n.children, id);
          }
          return n;
        })
        .filter((n) => n !== null);
    };

    this.menuData.update((currentData) => removeNodeRecursively(currentData, node.id));
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      newSet.delete(node.id);
      return newSet;
    });

    this.menuHttpService.deleteMenu(node.id).subscribe((res) => {});
  }

  // 切换节点展开状态
  toggleNode(node: FlatIMenuNode) {
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      return newSet;
    });
  }

  rowClicked(row: IMenuNode) {
    // if (this.clickedRows === row) {
    //   this.clickedRows = null; // 取消选中
    // } else {
    this.clickedRows = row; // 选中当前行
    // }
  }

  customContextMenu = {
    createFile: {
      label: '添加菜单',
      icon: 'file',
      action: (data: any) => {
        this.addChildNode(IMenuType.Dashboard, data);
      },
    },
    createFolder: {
      label: '添加目录',
      icon: 'folder-close',
      divider: true,
      action: (data: any) => {
        this.addChildNode(IMenuType.Parent, data);
      },
    },
  };

  get contextMenu() {
    return Object.values(this.customContextMenu);
  }

  loadMenuData() {
    this.loadingStatus = true;
    // 清空对应数据
    this.menuHttpService.getMenusByAppId(this.appId).subscribe(
      (res: IMenuNode[]) => {
        this.expandedNodes.set(new Set());
        this.menuData.set(res);
        this.loadingStatus = false;
        this.expandAll();
      },
      (error) => {
        this.loadingStatus = false;
      },
    );
  }

  loadDashboardData() {
    this.fileTreeService
      .getEntireTree(this.appId, 'dashboard')
      .pipe(delay(0))
      .subscribe({
        next: async (responseData) => {
          this.dashboardData.set(responseData);
        },
        error() {},
      });
  }

  ngOnInit(): void {
    this.loadMenuData();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    const tableElement = this.matTableElement.nativeElement;
    this.customDragTable = new CustomDragTable(tableElement, this);
    this.customDragTable.lastDropInfo$.subscribe((res) => {
      console.log('%c Line:612 🍺 res', 'color:#33a5ff', res);
    });
  }
}
