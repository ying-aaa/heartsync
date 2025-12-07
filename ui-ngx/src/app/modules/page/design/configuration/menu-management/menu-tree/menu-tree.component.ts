import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  OnDestroy,
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
import {
  generateUUID,
  getParamFromRoute,
  handlerNgElStyle,
  isUndefined,
} from '@src/app/core/utils';
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
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HsIconComponent } from '@src/app/shared/components/hs-icon/hs-icon.component';
import { IMatIconConfig } from '@src/app/shared/components/hs-icon/hs-icon.model';

interface IDropInfo {
  entityEl: HTMLElement;
  entityFolderEl: HTMLElement | null;
  entityIndex: number;
  toEl?: HTMLElement | null;
  toIndex: number;
}

function getDraggableEl(el: HTMLElement): HTMLElement | null {
  let node = el;
  while (node) {
    if (node.getAttribute('aria-draggable') === 'true') return node;
    node = node.parentElement as HTMLElement;
  }
  return null;
}

/**
 *
 * 获取当前元素的父目录元素
 * @param el 当前元素
 * @param level 层级，默认1级 -> 父目录, 2级 -> 爷爷目录
 * @returns 父目录元素
 */
function getFolderEl(el: HTMLElement, level = 1): HTMLElement | null {
  const elLevel = +el.getAttribute('aria-level')!;
  if (!elLevel) return null;
  let node = el;
  while (node) {
    node = node.previousElementSibling as HTMLElement;
    // 获取当前元素的父元素，因为数据是平铺的，只需要找当前level的小一级
    if (+node?.getAttribute('aria-level')! === elLevel - level) return node;
  }
  return null;
}

// 获取指定元素是顶层元素下的第几个子元素
function getEleChildIndex(folderEl: HTMLElement, childEl: HTMLElement): number | null {
  const children = folderEl.children;
  const toIndex = Array.from(children)
    .filter((child) => child.getAttribute('aria-level') === '0')
    .findIndex((child) => child === childEl);
  return toIndex !== -1 ? toIndex : null;
}

// 获取指定元素是父目录下的第几个子元素
function getFolderChildIndex(folderEl: HTMLElement, childEl: HTMLElement): number | null {
  let node = childEl;
  let toIndex = 0;
  while (node) {
    node = node.previousElementSibling as HTMLElement;
    if (node === folderEl) return toIndex;
    if (+node.getAttribute('aria-level')! === +folderEl.getAttribute('aria-level')! + 1) toIndex++;
  }
  return null;
}

/**
 * 判断划过的元素是不是拖拽元素的子孙元素
 * @param overEl
 * @param childEl
 * @returns boolean
 */
function isChildEl(overEl: HTMLElement, dragEl: HTMLElement) {
  const dragLevel = +dragEl.getAttribute('aria-level')!;
  const overLevel = +overEl.getAttribute('aria-level')!;
  // 在子元素往上查找父元素过程中，父元素层级是否出现过，如果出现过则代表不是 拖拽
  const levelRecord = [overLevel];
  let node = overEl;
  while (node) {
    const prevLevel = +node.getAttribute('aria-level')!;
    // 如果是拖拽元素，等级不一样，已有的不，第一次滑入该等级，则为子级元素
    if (node === dragEl && overLevel > dragLevel && !levelRecord.includes(prevLevel)) return true;
    if (prevLevel + 1 === levelRecord.at(-1)!) {
      levelRecord.push(prevLevel);
    }
    node = node.previousElementSibling as HTMLElement;
  }

  return false;
}
class CustomDragTable {
  // 事件委托
  containerEl!: HTMLElement;

  // 跟随元素
  followEl!: HTMLElement;

  // 表格组件实例
  tableThis!: MenuTreeComponent;

  // 实体元素
  entityEl: HTMLElement | null = null;

  // 实体元素层级
  entityLevel: number;

  // 是否移动中
  isMove$ = new BehaviorSubject(false);

  // 是否按下
  isDragging = false;

  // 按下定时器
  pressTimer: any = null;

  // 最后落点位置
  lastDropInfo: IDropInfo = {} as IDropInfo;
  // 发布
  lastDropInfo$ = new Subject<IDropInfo>();

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
    this.containerEl = el;
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
      .set(this.containerEl, {
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
        this.renderer.setStyle(this.containerEl, 'cursor', 'alias');
        this.renderer.setStyle(this.followEl, 'display', 'block');
      }
      if (!value) {
        this.renderer.removeStyle(this.containerEl, 'cursor');
        this.renderer.setStyle(this.followEl, 'display', 'none');
      }
    });

    this.subscribetions.push(sub);
  }

  // 鼠标按下触发
  mouseDown(e: MouseEvent) {
    this.pressTimer = setTimeout(() => {
      this.isDragging = true;
      this.entityEl = getDraggableEl(e.target as HTMLElement);

      if (this.entityEl) {
        this.entityLevel = Number(this.entityEl.getAttribute('aria-level')!);

        // 目录信息
        const entityFolderEl = getFolderEl(this.entityEl);
        const entityIndex = entityFolderEl
          ? getFolderChildIndex(entityFolderEl, this.entityEl)!
          : getEleChildIndex(this.containerEl, this.entityEl)!;

        this.lastDropInfo = {
          ...this.lastDropInfo,
          entityFolderEl,
          entityIndex,
          entityEl: this.entityEl,
        };
      }
    }, 300);
  }

  // 鼠标按下移动
  mouseMove(e: MouseEvent) {
    e.preventDefault();

    if (!this.isDragging) return;
    // 如果不是触发tr拖动
    if (!this.entityEl) return;

    const target = e.target as HTMLElement;

    // this.renderer.setStyle(target, 'cursor', `pointer`);
    // this.renderer.setStyle(target, 'border', `none`);

    // 划过的元素
    const overEl = getDraggableEl(target);
    if (!overEl) return;

    // 不能划过自己的子孙元素
    if (isChildEl(overEl, this.entityEl)) return;

    // 拖拽元素是目录的话不能在当前目录下滑动
    const rect = overEl.getBoundingClientRect();
    const overLevel = Number(overEl.getAttribute('aria-level'));
    const overFolder = overEl.getAttribute('aria-folder') === 'true';
    // 目录可以多延伸一级
    let overLevelNum = overFolder ? overLevel + 1 : overLevel;

    const overNextEl = overEl.nextElementSibling;
    const overNextLevel = Number(overNextEl?.getAttribute('aria-level')) || 0;

    let levelMargin = overLevelNum * 32 + 44;

    const { left, bottom } = rect;
    const moveX = e.clientX - left;

    while (overLevelNum >= 0) {
      // 如果下一个元素是当前的子级，则不能向前移动
      if (overFolder && overLevel === overNextLevel - 1) {
        // 等于当前父目录向后一级就终止
        if (overLevelNum === overLevel + 1) {
          this.lastDropInfo = {
            ...this.lastDropInfo,
            toEl: overEl,
            toIndex: 0,
          };
          break;
        }
      }
      // 如果下一个元素和当前是平级或者没有下一个元素，则不能向前移动
      if (overLevel === overNextLevel) {
        // 移入目录下
        if (overFolder) {
          this.lastDropInfo = {
            ...this.lastDropInfo,
            toEl: overEl,
            toIndex: 0,
          };
        }
        // 同级时终止
        if (overLevelNum === overLevel) {
          const folderEl = getFolderEl(overEl);
          const toIndex = folderEl
            ? getFolderChildIndex(folderEl, overEl)
            : getEleChildIndex(this.containerEl, overEl);
          this.lastDropInfo = {
            ...this.lastDropInfo,
            toEl: folderEl,
            toIndex: toIndex! + 1,
          };
          break;
        }
      }
      // 如果下一个元素不是子集也不是同级，那么便是其他组的
      if (overLevel > overNextLevel || Number.isNaN(overNextLevel)) {
        // 移入目录下
        if (overLevelNum > overLevel) {
          this.lastDropInfo = {
            ...this.lastDropInfo,
            toEl: overEl,
            toIndex: 0,
          };
        } else {
          // 推算是到了哪一层overLevel - overLevelNum + 1
          const folderEl = getFolderEl(overEl, overLevel - overLevelNum + 1);
          const prevFolderEl =
            overLevel === overLevelNum ? overEl : getFolderEl(overEl, overLevel - overLevelNum)!;
          const toIndex = folderEl
            ? getFolderChildIndex(folderEl, prevFolderEl)! + 1
            : getEleChildIndex(this.containerEl, prevFolderEl)! + 1;
          this.lastDropInfo = {
            ...this.lastDropInfo,
            toEl: folderEl,
            toIndex: toIndex!,
          };
        }
        // 最多到和下一级同级
        if (overLevelNum === overNextLevel) {
          break;
        }
      }
      // 如果没有下一个元素，

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
    clearTimeout(this.pressTimer);

    // 触发拖拽的鼠标样式
    this.isMove$.next(false);
    this.entityEl = null;

    // 如果落点和抬点在一个位置
    const { entityEl, entityFolderEl, entityIndex, toEl, toIndex } = this.lastDropInfo;
    if (isUndefined(toIndex)) return;

    // 在目录自身移动
    if (toEl === entityEl) return;
    // 最顶层同级移动
    if (!toEl) {
      const index = getEleChildIndex(this.containerEl, entityEl!);
      if (toIndex === index) return;
    }
    // 如果父级目录下同级移动
    if (toEl === entityFolderEl) {
      if (toIndex === entityIndex) return;
      if (toIndex - 1 === entityIndex) return;
    }

    if (entityFolderEl === toEl) {
      if (entityIndex < toIndex) {
        this.lastDropInfo.toIndex--;
      }
    }

    this.lastDropInfo$.next(this.lastDropInfo);

    this.lastDropInfo = {} as any;
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
    HsIconComponent,
  ],
})
export class MenuTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('MatTable', { read: ElementRef }) matTableElement!: ElementRef<HTMLTableElement>;

  IMenuType = IMenuType;

  appId: string = getParamFromRoute('appId', this.route)!;

  searchControl = new FormControl('');

  loadingStatus = false;

  displayedColumns: string[] = [
    'name',
    'icon',
    'menuType',
    'dashboardId',
    'isFullscreen',
    'actions',
  ];

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

  customDragTable: CustomDragTable | null = null;

  defaultIconConfig: { [key: string]: IMatIconConfig } = {
    folder_open: {
      type: 'two-tone',
      name: 'folder_open',
      color: 'var(--base-primary-color)',
      iconSize: 24,
      bgSize: 32,
    },
    folder: {
      type: 'two-tone',
      name: 'folder',
      color: 'var(--base-primary-color)',
      iconSize: 24,
      bgSize: 32,
    },
    description: {
      type: 'two-tone',
      name: 'description',
      color: 'var(--base-primary-color)',
      iconSize: 24,
      bgSize: 32,
    },
  };

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

  getNodeIconConfig(type: string) {
    const name = type === 'parent' ? 'folder' : 'description';

    return JSON.stringify({
      name,
      type: 'two-tone',
      color: 'var(--base-primary-color)',
      iconSize: 24,
      bgSize: 32,
    });
  }

  addChildNode(type: IMenuType, node: any) {
    this.loadingStatus = true;
    const nodeOriginData = this.findNode(node.id)!;
    const nodeChildrenLength = nodeOriginData.children?.length || 0;
    const icon = this.getNodeIconConfig(type);

    // 计算sort
    const newNode: IMenuNode = {
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon,
      menuType: type,
      parentMenuId: node.id,
      isFullscreen: false,
      sort: nodeChildrenLength + 1,
      dashboardId: null,
    };
    this.menuHttpService.createMenu(newNode).subscribe((res) => {
      if (type === IMenuType.Parent) {
        newNode.children = [];
      }
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

      this.loadingStatus = false;
    });
  }

  addSameNode(type: IMenuType, node: any) {
    this.loadingStatus = true;

    const parentNode = this.findNode(node?.parentMenuId);
    const nodeChildrenLength = parentNode
      ? parentNode.children?.length || 0
      : this.menuData().length;

    const icon = this.getNodeIconConfig(type);

    const newNode: IMenuNode = {
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon,
      menuType: type,
      parentMenuId: node && node.parentMenuId,
      isFullscreen: false,
      sort: nodeChildrenLength + 1,
      dashboardId: null,
    };

    this.menuHttpService.createMenu(newNode).subscribe((res) => {
      if (type === IMenuType.Parent) {
        newNode.children = [];
      }

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

      this.loadingStatus = false;
    });
  }

  deleteMenu(node: IMenuNode) {
    this.loadingStatus = true;
    if (node.id === this.clickedRows?.id) this.clickedRows = null;

    this.menuHttpService.deleteMenu(node.id).subscribe((res) => {
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
      this.loadingStatus = false;
    });
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
    const tbody = tableElement.querySelector('tbody')!;
    this.customDragTable = new CustomDragTable(tbody, this);
    const lastDropInfoSub = this.customDragTable.lastDropInfo$.subscribe((dropInfo: IDropInfo) => {
      const { entityEl, entityFolderEl, entityIndex: formIndex, toEl, toIndex } = dropInfo;
      const toData = toEl ? this.findNode(toEl.id)!.children : this.menuData();
      const entityData = this.findNode(entityEl.id)!;
      entityData.parentMenuId = toEl ? toEl.id : null;
      const formData = entityFolderEl
        ? this.findNode(entityFolderEl.id)!.children
        : this.menuData();
      this.menuData.update((currentData) => {
        if (entityFolderEl === toEl) {
          moveItemInArray(toData!, formIndex, toIndex);
        } else {
          transferArrayItem(formData!, toData!, formIndex, toIndex);
        }
        return [...currentData];
      });
    });
    this.customDragTable.subscribetions.push(lastDropInfoSub);
  }

  ngOnDestroy(): void {
    this.customDragTable?.destroy();
  }
}
