import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { debounceTime } from 'rxjs/operators';

declare const $: any;
const clipboard: any = {
  node: null,
  mode: null, // 'copy' 或 'cut'
};
// 自定义右键菜单函数
function customContextMenu(node: any) {
  // 默认菜单项
  const defaultItems = {
    rename: {
      label: '重命名',
      action: function (data: any) {
        const inst = $.jstree.reference(data.reference);
        inst.edit(inst.get_node(data.reference));
      },
    },
    remove: {
      label: '删除',
      action: function (data: any) {
        const inst = $.jstree.reference(data.reference);
        const selected = inst.get_selected();

        const node = inst.get_node(selected[0]);

        // 检查是否为目录且有子节点
        if (
          node.type === 'folder' &&
          node.children &&
          node.children.length > 0
        ) {
          console.log('不能删除包含子节点的目录', 'error');
          return;
        }
        inst.delete_node(data.reference);
      },
    },
    copy: {
      label: '复制',
      icon: 'fa fa-copy',
      action: function (data: any) {
        const inst = $.jstree.reference(data.reference);
        clipboard.node = inst.get_node(data.reference);
        clipboard.mode = 'copy';
        console.log('已复制节点:', clipboard.node.text);
      },
    },
    cut: {
      label: '剪切',
      icon: 'fa fa-cut',
      action: function (data: any) {
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
    return {
      createFolder: {
        label: '添加目录',
        action: function (data: any) {
          const inst = $.jstree.reference(data.reference);
          inst.create_node(
            data.reference,
            { text: '目录名称', type: 'folder' },
            'last',
            (newNode: any) => {
              if (newNode) {
                inst.edit(newNode);
              }
            },
          );
        },
      },
      createFile: {
        label: '添加文件',
        action: function (data: any) {
          const inst = $.jstree.reference(data.reference);
          inst.create_node(
            data.reference,
            { text: '文件名称', type: 'file' },
            'last',
            (newNode: any) => {
              if (newNode) {
                console.log('%c Line:83 🌭 newNode', 'color:#ea7e5c', newNode);
                inst.edit(newNode);
              }
            },
          );
        },
      },
      ...defaultItems,
      paste: {
        label: '粘贴',
        icon: 'fa fa-paste',
        _disabled: function (data: any) {
          // 如果没有复制/剪切节点或尝试粘贴到自身，则禁用
          return (
            !clipboard.node ||
            clipboard.node.id === node.id ||
            $.inArray(node.id, clipboard.node.parents) !== -1
          );
        },
        action: function (data: any) {
          const inst = $.jstree.reference(data.reference);
          const targetNode = inst.get_node(data.reference);

          if (clipboard.mode === 'copy') {
            // 复制节点
            const newNode = $.extend(true, {}, clipboard.node);
            newNode.id = 'new_' + new Date().getTime(); // 生成新ID

            inst.create_node(targetNode, newNode, 'last', function () {
              console.log('节点已复制到:', targetNode.text);
            });
          } else if (clipboard.mode === 'cut') {
            // 移动节点
            inst.move_node(clipboard.node, targetNode, 'last', function () {
              console.log('节点已移动到:', targetNode.text);
              $('#' + clipboard.node.id).removeClass('jstree-cut');
              clipboard.node = null;
              clipboard.mode = null;
            });
          }
        },
      },
    };
  }

  return defaultItems; // 默认菜单项
}

@Component({
  selector: 'hs-tree',
  templateUrl: './hs-tree.component.html',
  styleUrls: ['./hs-tree.component.less'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
  ],
})
export class HsTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('jsTreeContainer', { static: false }) jstreeContainer: ElementRef;

  treeInstance: any;

  fileName = new FormControl('');

  filterCount = 0;

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  initJstree() {
    const data = [
      {
        text: '常规费用报销',
        type: 'folder',
        children: [
          {
            text: '常规报销表单',
            type: 'file',
          },
          {
            text: '常规报销列表',
            type: 'file',
          },
          {
            text: '组件',
            type: 'folder',
          },
        ],
      },
      {
        text: '相关科目',
        type: 'folder',
        children: [
          {
            text: '科目列表',
            type: 'file',
          },
          {
            text: '科目详情',
            type: 'folder',
            children: [
              {
                text: '一级科目',
                type: 'file',
              },
              {
                text: '二级科目',
                type: 'file',
              },
            ],
          },
        ],
      },
    ];
    const jstreeContainerElement = this.jstreeContainer.nativeElement;

    // 注册 jsTree
    this.treeInstance = $(jstreeContainerElement).jstree({
      core: {
        animation: 0,
        // @ts-ignore
        check_callback: function (op, node, parent, pos, more) {
          if (op === 'move_node' || op === 'copy_node') {
            if (parent && parent.type === 'file') return false; // 禁止操作
          }
          return true; // 其他操作允许
        },
        themes: { stripes: true },
        data: data,
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
        items: customContextMenu, // 自定义右键菜单
      },
      plugins: ['contextmenu', 'dnd', 'search', 'state', 'types', 'wholerow'],
    });

    // 菜单位置更新事件
    $(jstreeContainerElement).on('contextmenu.jstree', function (e: any) {
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

    // 绑定事件监听
    this.treeInstance.on('changed.jstree', (e: Event, data: any) => {
      console.log('Node selected:', data.selected);
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
  onKeyDown(e: KeyboardEvent): void {
    // 确保树已初始化且获得焦点
    if (!this.treeInstance || !this.treeInstance.jstree(true)) return;

    const inst = this.treeInstance.jstree(true);
    const selected = inst.get_selected();

    // 只处理当有节点被选中时的Ctrl组合键
    if (selected.length === 0) return;

    // Delete键 - 删除节点
    if (e.keyCode === 46) {
      // Delete键
      e.preventDefault();

      if (selected.length === 0) {
        console.log('请先选择要删除的节点', 'warning');
        return;
      }

      const node = inst.get_node(selected[0]);

      // 检查是否为目录且有子节点
      if (node.type === 'folder' && node.children && node.children.length > 0) {
        console.log('不能删除包含子节点的目录', 'error');
        return;
      }

      // 触发删除操作（会经过check_callback验证）
      inst.delete_node(node);
      return;
    }

    // Ctrl+C - 复制
    if (e.ctrlKey && e.keyCode === 67) {
      e.preventDefault();
      clipboard.node = inst.get_node(selected[0]);
      clipboard.mode = 'copy';
      $('.jstree-cut').removeClass('jstree-cut');
      console.log('已复制: ' + clipboard.node.text);
    }
    // Ctrl+X - 剪切
    else if (e.ctrlKey && e.keyCode === 88) {
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
    else if (e.ctrlKey && e.keyCode === 86) {
      e.preventDefault();
      if (!clipboard.node) {
        console.log('剪贴板为空', 'error');
        return;
      }

      const targetNode = selected[0];
      const node = inst.get_node(targetNode);

      // 检查是否尝试粘贴到自身或子节点
      if (
        clipboard.node.id === node.id ||
        $.inArray(node.id, clipboard.node.parents) !== -1
      ) {
        console.log('不能粘贴到自身或子节点', 'error');
        return;
      }

      if (clipboard.mode === 'copy') {
        // 复制节点
        const newNode = $.extend(true, {}, clipboard.node);
        newNode.id = 'new_' + new Date().getTime(); // 生成新ID

        inst.create_node(node, newNode, 'last', function () {
          console.log('已粘贴复制的节点到: ' + node.text);
        });
      } else if (clipboard.mode === 'cut') {
        // 移动节点
        inst.move_node(clipboard.node, node, 'last', function () {
          console.log('已移动节点到: ' + node.text);
          $('#' + clipboard.node.id).removeClass('jstree-cut');
          clipboard.node = null;
          clipboard.mode = null;
        });
      }
    }
  }

  ngOnInit() {}

  async ngAfterViewInit() {
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
      this.treeInstance.destroy();
    }
  }
}
