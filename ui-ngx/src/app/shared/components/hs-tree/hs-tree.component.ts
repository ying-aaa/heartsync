import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateNodeDto,
  FileTreeService,
  MoveNodeDto,
} from '@src/app/core/http/file-tree.service';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { debounceTime, delay } from 'rxjs/operators';
import { IFileTreeConfig, ITreeFeatureList } from './tree.model';
import { IAnyPropObj } from '@shared/models/common-component';
import { pick } from '@src/app/core/utils';
import { HsSvgModule } from '@shared/components/hs-svg/hs-svg.module';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

declare const $: any;

@Component({
  selector: 'hs-tree',
  templateUrl: './hs-tree.component.html',
  styleUrls: ['./hs-tree.component.less'],
  imports: [
    HsSvgModule,
    CommonModule,
    MatIconModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    NgScrollbarModule,
    ReactiveFormsModule,
  ],
})
export class HsTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('jsTreeContainer', { static: false }) jstreeContainer: ElementRef;
  @ViewChild('ContentMenu') contentMenuTemplate!: TemplateRef<any>;

  private overlayRef!: OverlayRef;

  businessId = input.required<string>();
  treeConfig = input.required<IFileTreeConfig>();

  featureList = computed(() => this.treeConfig().featureList);

  treeInstance: any;

  fileName = new FormControl('');

  filterCount = 0;

  // 创建的新node
  newNodeFlag: any = null;

  // 右键的node
  dbClickNode: any = null;

  // 复制和剪切板
  clipboard: any = {
    node: null,
    mode: null, // 'copy' 或 'cut'
  };

  customContextMenu1 = {
    createFile: {
      label: '添加文件',
      icon: 'file',
      action: (data: any) => {
        this.createNode('file', this.dbClickNode);
        this.closeMenu();
      },
    },
    createFolder: {
      label: '添加目录',
      icon: 'folder-close',
      divider: true,
      action: (data: any) => {
        this.createNode('folder', this.dbClickNode);
        this.closeMenu();
      },
    },
    rename: {
      label: '重命名',
      icon: 'edit',
      action: (data: any) => {
        this.renameNode(this.dbClickNode);
        this.closeMenu();
      },
    },
    remove: {
      label: '删除',
      icon: 'remove',
      divider: true,
      action: async (data: any) => {
        this.removeNode(this.dbClickNode);
        this.closeMenu();
      },
    },
    copy: {
      label: '复制',
      matIcon: true,
      icon: 'file_copy',
      action: (data: any) => {
        this.copyNode(this.dbClickNode);
        this.closeMenu();
      },
    },
    cut: {
      label: '剪切',
      matIcon: true,
      icon: 'content_cut',
      action: (data: any) => {
        this.cutNode(this.dbClickNode);
        this.closeMenu();
      },
    },
    paste: {
      label: '粘贴',
      matIcon: true,
      icon: 'content_paste',
      action: (data: any) => {
        this.pasteNode(this.dbClickNode?.id);
        this.closeMenu();
      },
    },
  };

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private fileTreeService: FileTreeService,
    private _snackBar: MatSnackBar,
    private overlay: Overlay,
    private vcRef: ViewContainerRef,
  ) {}

  includesFeature(feature: ITreeFeatureList) {
    return this.featureList().includes(feature);
  }

  initJstree() {
    const jstreeContainerElement = this.jstreeContainer.nativeElement;

    // 注册 jsTree
    this.treeInstance = $(jstreeContainerElement).jstree({
      core: {
        animation: 0,
        multiple: false,
        // @ts-ignore
        check_callback(op, node, parent, pos, more) {
          if (op === 'move_node' || op === 'copy_node') {
            if (parent && parent.type === 'file') return false; // 禁止操作
          }
          return true; // 其他操作允许
        },
        themes: { stripes: true },
        strings: {
          'Loading ...': '加载中...',
          'New node': '新节点',
          // 可以添加更多自定义文本
        },
        data: (node: any, callback: any) => {
          this.fileTreeService
            .getEntireTree(this.businessId())
            .pipe(delay(0))
            .subscribe({
              next(responseData) {
                callback(responseData);
              },
              error() {
                callback([]);
              },
            });
        },
        expand_selected_onload: true,
        open_parents: true, // 自动展开所有父节点
      },
      types: {
        folder: {
          icon: 'hs-folder-icon',
          valid_children: ['folder', 'file'], // 文件夹可以包含文件夹和文件
        },
        file: {
          icon: 'hs-file-icon',
          li_attr: { 'aria-expanded': 'false' }, // 禁用展开按钮
          no_children: true, // 禁止文件节点有子节点
        },
      },

      plugins: (() => {
        const plugins = ['state', 'types', 'wholerow', 'sort'];
        if (this.includesFeature('dnd')) plugins.push('dnd');
        if (this.includesFeature('search')) plugins.push('search');
        return plugins;
      })(),
      sort: function (a: any, b: any) {
        const getNodeText = (node: any) =>
          this.get_node(node).text.toLowerCase();
        const aText = getNodeText(a);
        const bText = getNodeText(b);

        // 自然排序比较函数
        const naturalCompare = (aStr: any, bStr: any) => {
          // 使用正则拆分数字和非数字部分
          const tokenize = (str: string) => str.match(/(\d+)|(\D+)/g) || [];
          const aTokens = tokenize(aStr);
          const bTokens = tokenize(bStr);

          // 逐块比较
          for (let i = 0; i < Math.max(aTokens.length, bTokens.length); i++) {
            const aToken = aTokens[i] || '';
            const bToken = bTokens[i] || '';

            // 尝试解析为数字
            const aNum = parseInt(aToken, 10);
            const bNum = parseInt(bToken, 10);

            // 处理数字比较
            if (!isNaN(aNum) && !isNaN(bNum)) {
              if (aNum !== bNum) return aNum - bNum;
            }
            // 处理文本比较（使用本地化排序）
            else {
              const compareResult = aToken.localeCompare(bToken, undefined, {
                numeric: true,
                sensitivity: 'base',
              });
              if (compareResult !== 0) return compareResult;
            }
          }
          return 0; // 所有块相等
        };

        return naturalCompare(aText, bText);
      },
    });

    // 绑定事件监听
    this.treeInstance.on('changed.jstree', (e: Event, data: any) => {
      const selectEvent = this.treeConfig().selectEvent;
      selectEvent && selectEvent(data.node, this.treeInstance);
    });

    // 重命名节点
    this.treeInstance.on('rename_node.jstree', (e: Event, data: any) => {
      const tempNode = data.node;
      if (this.newNodeFlag && this.newNodeFlag.id === tempNode.id) {
        const { parent: parentId, text: name, type } = tempNode;
        const nodeData: CreateNodeDto = {
          name,
          type,
          businessId: this.businessId(),
        };
        if (parentId !== '#') {
          nodeData.parentId = parentId;
        }
        this.fileTreeService.createNode(nodeData).subscribe({
          next: (res) => {
            this.treeInstance.jstree().set_id(tempNode, res.id); // 替换临时ID为正式ID
            tempNode.original = res.data;
            this.treeInstance.jstree().deselect_all(); // 清除历史选中
            this.treeInstance.jstree().select_node(tempNode, false, false); // true 表示聚焦

            this._snackBar.open(`创建成功`, '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
          },
          error: (error) => {
            this._snackBar.open(`创建失败 ${error.message}`, '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
            this.treeInstance.jstree().delete_node(tempNode);
          },
        });
      } else {
        const { id, text: name } = data.node;
        this.fileTreeService.updateNode(id, { name }).subscribe({
          next: (res) => {
            this._snackBar.open(`修改成功`, '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
          },
          error: (error) => {
            this._snackBar.open(`修改失败 ${error.message}`, '确定', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3 * 1000,
            });
          },
        });
      }

      this.newNodeFlag = null;
    });

    // 移动节点
    this.treeInstance.on('move_node.jstree', (e: Event, data: any) => {
      // 向已有父目录调用移动时，无法调用接口
      if (data.node.parent === (data.node.original.parentId || '#')) return;

      this.clipboard.node = data.node;
      this.moveNode(data.node.parent);
    });
  }
  initJsTreeFilter() {
    this.fileName.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value: any) => {
        const match = value.trim();

        // 获取 jstree 实例
        const tree = this.treeInstance.jstree();

        if (match === '') {
          // 清除搜索并展开所有节点
          tree.clear_search();
          tree.open_all();
          this.filterCount = 0;
          return;
        }

        // 执行搜索并处理结果
        tree.search(match, false, true);

        // 获取匹配节点数量
        const matches = tree.get_container().find('.jstree-search');
        this.filterCount = matches.length;

        // 自动展开匹配节点的父节点
        matches.each((i: number, el: HTMLElement) => {
          const nodeId = el.getAttribute('id');
          const parents = tree.get_path(nodeId);
          parents.forEach((parentId: string) => {
            tree.open_node(parentId);
          });
        });
      });
  }

  @HostListener('keydown', ['$event'])
  async onKeyDown(e: KeyboardEvent): Promise<void> {
    // 确保树已初始化且获得焦点
    if (!this.treeInstance || !this.treeInstance.jstree(true)) return;

    const inst = this.treeInstance.jstree(true);
    const selected = inst.get_selected();

    const node = inst.get_node(selected[0]);

    // 只处理当有节点被选中时的Ctrl组合键
    if (selected.length === 0) return;

    // Delete键 - 删除节点
    if (e.key === 'Delete' && this.includesFeature('remove')) {
      // Delete键
      e.preventDefault();
      this.removeNode(node);
      return;
    }

    // Ctrl+C - 复制
    if (e.ctrlKey && e.key === 'c' && this.includesFeature('copy')) {
      e.preventDefault();
      this.copyNode(node);
    }
    // Ctrl+X - 剪切
    else if (e.ctrlKey && e.key === 'x' && this.includesFeature('cut')) {
      e.preventDefault();
      this.cutNode(node);
    }
    // Ctrl+V - 粘贴
    else if (e.ctrlKey && e.key === 'v' && this.includesFeature('paste')) {
      e.preventDefault();
      if (!this.clipboard.node) return;
      const InNodeId = selected[0];
      this.pasteNode(InNodeId);
    }
  }

  // 自定义右键菜单函数
  get contextMenu(): any {
    const node = this.dbClickNode;
    let menus: any = {};
    if (node) {
      if (node.type === 'file') {
        menus = pick(this.customContextMenu1, [
          'rename',
          'remove',
          'copy',
          'cut',
        ]);
      } else {
        menus = pick(this.customContextMenu1, [
          'createFile',
          'createFolder',
          'rename',
          'remove',
          'copy',
          'cut',
          'paste',
        ]);
      }
    } else {
      menus = pick(this.customContextMenu1, [
        'createFile',
        'createFolder',
        'paste',
      ]);
    }
    return Object.values(pick(menus, this.featureList()));
  }

  public createNode(type: string, inNode?: any) {
    const inst = this.treeInstance.jstree();
    inst.create_node(
      inNode || '#',
      { text: type === 'file' ? '文件名称' : '目录名称', type },
      'last',
      (newNode: any) => {
        if (!newNode) return;
        this.newNodeFlag = newNode;
        this.renameNode(newNode);
      },
    );
  }

  public renameNode(node: any) {
    const inst = this.treeInstance.jstree();
    inst.edit(node);
  }

  public async removeNode(node: any) {
    const inst = this.treeInstance.jstree();

    if (this.treeConfig().deleteEvent) {
      const res = await this.treeConfig().deleteEvent!(node, this.treeInstance);
      if (!res) return;
    }

    this.fileTreeService.deleteNode(node.id).subscribe({
      next: () => {
        inst.delete_node(node);
        this._snackBar.open('删除成功！', '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
      },
      error: (error) => {
        this._snackBar.open(`${error.message}`, '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
      },
    });
  }

  public copyNode(node: any) {
    this.clipboard.node = node;
    this.clipboard.mode = 'copy';
  }

  public cutNode(node: any) {
    this.clipboard.node = node;
    this.clipboard.mode = 'cut';
  }

  public pasteNode(parentId: string) {
    const { mode } = this.clipboard;
    if (mode === 'copy') {
      this.copyPasteNode(parentId);
    } else {
      this.cutPasteNode(parentId);
    }
  }

  copyPasteNode(parentId: string) {
    parentId = parentId ?? '#';
    const inst = this.treeInstance.jstree(true);
    const node = this.clipboard.node;
    const { text, type } = node;

    inst.create_node(parentId, { text, type }, 'first', (newNode: any) => {
      const treeData: any = {
        name: text,
        type,
        businessId: this.businessId(),
      };
      if (parentId !== '#') {
        treeData.parentId = parentId;
      }
      this.fileTreeService.createNode(treeData).subscribe({
        next: (res) => {
          this.dbClickNode = null;
          this.treeInstance.jstree().set_id(newNode, res.id); // 替换临时ID为正式ID
          newNode.original = res;
          this.treeInstance.jstree().deselect_all(); // 清除历史选中
          this.treeInstance.jstree().select_node(newNode, false, false); // true 表示聚焦

          this._snackBar.open(`粘贴成功`, '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
        },
        error: (error) => {
          this._snackBar.open(`粘贴失败 ${error.message}`, '确定', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3 * 1000,
          });
          this.treeInstance.jstree().delete_node(newNode);
        },
      });
      console.log('已粘贴复制的节点到: ' + node.text);
    });
  }

  cutPasteNode(parentId: string) {
    parentId = parentId ?? '#';
    const inst = this.treeInstance.jstree(true);
    const node = this.clipboard.node;
    inst.move_node(node, parentId, 'last');
  }

  public moveNode(parentId: string) {
    const inst = this.treeInstance.jstree(true);
    const node = this.clipboard.node;
    const { id } = node;
    const treeData: MoveNodeDto = {
      businessId: this.businessId(),
    };
    if (parentId !== '#') {
      treeData.newParentId = parentId;
    }

    this.fileTreeService.moveNode(id, treeData).subscribe({
      next: (res) => {
        this.dbClickNode = null;
        inst.open_node(parentId);
        node.original.parentId = parentId;
        this._snackBar.open(`移动成功`, '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
      },
      error: (error) => {
        this._snackBar.open(`移动失败 ${error.message}`, '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
        inst.move_node(node, node.original.parentId || '#', 'last');
      },
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.scriptLoaderService
      .loadScripts(['jquery.min.js', 'jstree.min.js'])
      .subscribe({
        next: () => {},
        error: (error) => console.error('Error loading script:', error),
        complete: () => {
          this.initJstree();
          this.listenToRightClick();
        },
      });

    this.initJsTreeFilter();
  }

  private listenToRightClick() {
    this.treeInstance.on('contextmenu.jstree', (e: any) => {
      e.preventDefault();

      // 获取 jsTree 实例
      const jsTreeApi = this.treeInstance.jstree(true);

      // 通过事件目标元素获取节点数据
      const node = jsTreeApi.get_node(e.target);

      // 判断是否为有效节点
      if (node && node.id !== '#') {
        this.dbClickNode = node;
        this.openMenu(e.clientX + 8, e.clientY + 8);
      } else {
        this.dbClickNode = null;
        this.openMenu(e.clientX + 8, e.clientY + 8);
      }
    });
  }

  private openMenu(x: number, y: number) {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }

    // 创建 Overlay
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withPositions([
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    // 将菜单模板附加到 Overlay
    const portal = new TemplatePortal(this.contentMenuTemplate, this.vcRef);
    this.overlayRef.attach(portal);

    document.addEventListener('click', this.globalClickListener);
  }

  private globalClickListener = (event: MouseEvent) => {
    const menuElement = this.overlayRef?.overlayElement;
    const clickedInside = menuElement?.contains(event.target as Node);

    if (!clickedInside) {
      this.closeMenu();
    }
  };

  private closeMenu() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      document.removeEventListener('click', this.globalClickListener); // 清理监听
    }
  }

  ngOnDestroy(): void {
    // 销毁 jsTree 实例
    if (this.treeInstance) {
      $.jstree.destroy && $.jstree.destroy();
    }
  }
}
