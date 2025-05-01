import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
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

declare const $: any;
const clipboard: any = {
  node: null,
  mode: null, // 'copy' 或 'cut'
};

@Component({
  selector: 'hs-tree',
  templateUrl: './hs-tree.component.html',
  styleUrls: ['./hs-tree.component.less'],
  imports: [
    HsSvgModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
  ],
})
export class HsTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('jsTreeContainer', { static: false }) jstreeContainer: ElementRef;

  businessId = input.required<string>();
  treeConfig = input.required<IFileTreeConfig>();

  featureList = computed(() => this.treeConfig().featureList);

  treeInstance: any;

  fileName = new FormControl('');

  filterCount = 0;

  newNodeFlag: any = null;

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private fileTreeService: FileTreeService,
    private _snackBar: MatSnackBar,
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
            .pipe(delay(3000))
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
      contextmenu: {
        items: this.customContextMenu.bind(this), // 自定义右键菜单
      },
      plugins: (() => {
        const plugins = ['contextmenu', 'state', 'types', 'wholerow', 'sort'];
        if (this.includesFeature('dnd')) plugins.push('dnd');
        if (this.includesFeature('search')) plugins.push('search');
        return plugins;
      })(),
      sort: function (a: any, b: any) {
        // 获取两个节点的文本内容
        const aText = this.get_node(a).text.toLowerCase();
        const bText = this.get_node(b).text.toLowerCase();

        // 按字母顺序排序
        if (aText < bText) return -1;
        if (aText > bText) return 1;
        return 0;
      },
    });

    // 菜单位置更新事件
    $(jstreeContainerElement).on('contextmenu.jstree', (e: any) => {
      e.preventDefault();
      const inst = $.jstree.reference(e.target);
      const node = inst.get_node(e.target);
      inst.show_contextmenu(node);

      if (node) {
        const $menu = $('.vakata-context.jstree-contextmenu');
        $menu.css({
          top: e.pageY + 5 + 'px',
          left: e.pageX + 5 + 'px',
        });
      }
    });
    // 监听节点选中事件
    // @ts-ignore

    // 绑定事件监听
    this.treeInstance.on('changed.jstree', (e: Event, data: any) => {
      console.log('Node selected:', data);
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
      const { id, parent } = data.node;
      const formData: MoveNodeDto = {
        businessId: this.businessId(),
      };
      if (parent !== '#') {
        formData.newParentId = +parent;
      }
      this.fileTreeService.moveNode(id, formData).subscribe({
        next: (res) => {
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
        },
      });
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

    // 只处理当有节点被选中时的Ctrl组合键
    if (selected.length === 0) return;

    // Delete键 - 删除节点
    if (e.keyCode === 46 && this.includesFeature('remove')) {
      // Delete键
      e.preventDefault();

      if (selected.length === 0) {
        console.log('请先选择要删除的节点', 'warning');
        return;
      }

      const node = inst.get_node(selected[0]);

      if (this.treeConfig().deleteEvent) {
        const res = await this.treeConfig().deleteEvent!(
          node,
          this.treeInstance,
        );
        if (!res) return;
      }

      // 检查是否为目录且有子节点
      if (node.type === 'folder' && node.children && node.children.length > 0) {
        console.log('不能删除包含子节点的目录', 'error');
        return;
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
      });

      // 触发删除操作（会经过check_callback验证）
      return;
    }

    // Ctrl+C - 复制
    if (e.ctrlKey && e.keyCode === 67 && this.includesFeature('copy')) {
      e.preventDefault();
      clipboard.node = inst.get_node(selected[0]);
      clipboard.mode = 'copy';
      $('.jstree-cut').removeClass('jstree-cut');
      console.log('已复制: ' + clipboard.node.text);
    }
    // Ctrl+X - 剪切
    else if (e.ctrlKey && e.keyCode === 88 && this.includesFeature('cut')) {
      e.preventDefault();
      clipboard.node = inst.get_node(selected[0]);
      clipboard.mode = 'cut';
      $('.jstree-cut').removeClass('jstree-cut');
      $('#' + clipboard.node.id).addClass('jstree-cut');
      console.log(
        '已剪切: ' + clipboard.node.text + ' - 请选择目标位置后按Ctrl+V粘贴',
      );
    }
    // Ctrl+V - 粘贴
    else if (e.ctrlKey && e.keyCode === 86 && this.includesFeature('paste')) {
      e.preventDefault();
      if (!clipboard.node) {
        console.log('剪贴板为空', 'error');
        return;
      }

      const moveInNodeId = selected[0];
      const moveInNode = inst.get_node(moveInNodeId);
      const targetNode = clipboard.node;

      // 查询子节点中是否存在指定名称的节点
      const hasChildWithName = (parentNode: any, name: string) => {
        const children = parentNode.children;
        if (!children) return false;

        // 遍历子节点
        for (const childId of children) {
          const child = this.treeInstance.jstree().get_node(childId);
          if (child.text === name) return true;
        }
        return false; // 未找到匹配的子节点
      };

      // 检查是否尝试粘贴到自身或子节点
      if (
        targetNode.id === moveInNode.id ||
        targetNode.parent === moveInNode.id ||
        hasChildWithName(moveInNode, targetNode.text)
      ) {
        console.log('同一目录下重复的节点名称', 'error');
        return;
      }

      if (clipboard.mode === 'copy') {
        inst.create_node(
          moveInNode,
          { text: targetNode.text, type: targetNode.type },
          'last',
          (newNode: any) => {
            const { text: name, type } = newNode;
            const { id: parentId } = moveInNode;

            this.fileTreeService
              .createNode({
                name,
                type,
                parentId,
                businessId: this.businessId(),
              })
              .subscribe({
                next: (res) => {
                  this.treeInstance.jstree().set_id(newNode, res.data.id); // 替换临时ID为正式ID
                  newNode.original = res.data;
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
            console.log('已粘贴复制的节点到: ' + moveInNode.text);
          },
        );
      } else if (clipboard.mode === 'cut') {
        // 移动节点
        inst.move_node(clipboard.node, moveInNode, 'last', function () {
          console.log('已移动节点到: ' + moveInNode.text);
          $('#' + clipboard.node.id).removeClass('jstree-cut');
          clipboard.node = null;
          clipboard.mode = null;
        });
      }
    }
  }

  // 自定义右键菜单函数
  customContextMenu(node: any) {
    const that = this;
    // 默认菜单项
    let defaultItems: IAnyPropObj = {
      rename: {
        label: '重命名',
        action(data: any) {
          const inst = $.jstree.reference(data.reference);
          inst.edit(inst.get_node(data.reference));
        },
      },
      remove: {
        label: '删除',
        action: async (data: any) => {
          const inst = $.jstree.reference(data.reference);
          const selected = inst.get_selected();

          const node = inst.get_node(selected[0]);

          if (this.treeConfig().deleteEvent) {
            const res = await this.treeConfig().deleteEvent!(
              node,
              this.treeInstance,
            );
            if (!res) return;
          }

          // 检查是否为目录且有子节点
          // if (
          //   node.type === 'folder' &&
          //   node.children &&
          //   node.children.length > 0
          // ) {
          //   console.log('不能删除包含子节点的目录', 'error');
          //   return;
          // }

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
        },
      },
      copy: {
        label: '复制',
        icon: 'fa fa-copy',
        action(data: any) {
          const inst = $.jstree.reference(data.reference);
          clipboard.node = inst.get_node(data.reference);
          clipboard.mode = 'copy';
          console.log('已复制节点:', clipboard.node.text);
        },
      },
      cut: {
        label: '剪切',
        icon: 'fa fa-cut',
        action(data: any) {
          const inst = $.jstree.reference(data.reference);
          clipboard.node = inst.get_node(data.reference);
          clipboard.mode = 'cut';
          console.log('已剪切节点:', clipboard.node.text);

          // 视觉反馈 - 添加剪切样式
          $('#' + clipboard.node.id).addClass('jstree-cut');
        },
      },

      // sep: { type: 'separator' },
    };

    // 根据节点类型调整菜单项
    if (node.type === 'folder') {
      defaultItems = {
        createFile: {
          label: '添加文件',
          action: (data: any) => {
            this.createNode('file', data.reference);
          },
        },
        createFolder: {
          label: '添加目录',
          action: (data: any) => {
            this.createNode('folder', data.reference);
          },
        },
        ...defaultItems,
        paste: {
          label: '粘贴',
          icon: 'fa fa-paste',
          _disabled(data: any) {
            // 如果没有复制/剪切节点或尝试粘贴到自身，则禁用
            return (
              !clipboard.node ||
              clipboard.node.id === node.id ||
              $.inArray(node.id, clipboard.node.parents) !== -1
            );
          },
          action: (data: any) => {
            const inst = $.jstree.reference(data.reference);
            const moveInNode = inst.get_node(data.reference);
            const targetNode = clipboard.node;
            if (clipboard.mode === 'copy') {
              inst.create_node(
                data.reference,
                { text: targetNode.text, type: targetNode.type },
                'last',
                (newNode: any) => {
                  const { text: name, type } = newNode;
                  const { id: parentId } = moveInNode;

                  this.fileTreeService
                    .createNode({
                      name,
                      type,
                      parentId,
                      businessId: this.businessId(),
                    })
                    .subscribe({
                      next: (res) => {
                        this.treeInstance.jstree().set_id(newNode, res.data.id); // 替换临时ID为正式ID
                        newNode.original = res.data;
                        this.treeInstance.jstree().deselect_all(); // 清除历史选中
                        this.treeInstance
                          .jstree()
                          .select_node(newNode, false, false); // true 表示聚焦

                        this._snackBar.open(`粘贴成功`, '确定', {
                          horizontalPosition: 'center',
                          verticalPosition: 'top',
                          duration: 3 * 1000,
                        });
                      },
                      error: (error) => {
                        this._snackBar.open(
                          `粘贴失败 ${error.message}`,
                          '确定',
                          {
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            duration: 3 * 1000,
                          },
                        );
                        this.treeInstance.jstree().delete_node(newNode);
                      },
                    });
                  console.log('已粘贴复制的节点到: ' + moveInNode.text);
                },
              );
            } else if (clipboard.mode === 'cut') {
              // 移动节点
              inst.move_node(clipboard.node, moveInNode, 'last', function () {
                console.log('节点已移动到:', moveInNode.text);
                $('#' + clipboard.node.id).removeClass('jstree-cut');
                clipboard.node = null;
                clipboard.mode = null;
              });
            }
          },
        },
      };
    }

    return pick(defaultItems, this.featureList()); // 默认菜单项
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
        inst.edit(newNode);
      },
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.scriptLoaderService
      .loadScripts(['jquery.min.js', 'jstree.min.js'])
      .subscribe({
        next: () => {},
        error: (error) => console.error('Error loading script:', error),
        complete: () => this.initJstree(),
      });

    this.initJsTreeFilter();
  }

  ngOnDestroy(): void {
    // 销毁 jsTree 实例
    if (this.treeInstance) {
      $.jstree.destroy && $.jstree.destroy();
    }
  }
}
