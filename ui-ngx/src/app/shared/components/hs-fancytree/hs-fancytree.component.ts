import { AfterViewInit, Component, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { IFancyTreeConfig } from '../../models/public-api';

declare var $: any;
@Component({
  selector: 'hs-fancytree',
  templateUrl: './hs-fancytree.component.html',
  styleUrls: ['./hs-fancytree.component.less'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
  ],
})
export class HsFancytreeComponent implements OnInit, AfterViewInit {
  config = input.required<IFancyTreeConfig>();

  treeInstance: any;

  fileName = new FormControl('');

  filterCount = 0;

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  ngOnInit() {} 

  async loadTreeData() {
    try {
      const treeData = await this.config().loadTreeData();
      this.treeInstance.options.source = treeData;
      this.treeInstance.reload();
    } catch (error) {}
  }

  async ngAfterViewInit() {
    this.scriptLoaderService
      .loadScripts([
        'jquery.min.js',
        'jquery-ui.min.js',
        'jquery.ui-contextmenu.min.js',
        'jquery.fancytree-all.min.js',
      ])
      .subscribe({
        next: () => {
          this.initFancytree();
        },
        error: (error) => console.error('Error loading script:', error),
        // complete: () => this.initFancytree(),
      });

    this.initFancytreeFilter();
  }

  initFancytree() {
    let CLIPBOARD: { mode: any; data: any } | any = null;
    const that = this;

    $('#hs-fancytree')
      .fancytree({
        extensions: ['dnd5', 'edit', 'multi', 'childcounter', 'filter', "glyph", "wide"],
        checkbox: false,
        quicksearch: true,
        filter: {
          autoApply: true, // Re-apply last filter if lazy data is loaded
          autoExpand: false, // Expand all branches that contain matches while filtered
          counter: true, // Show a badge with number of matching child nodes near parent icons
          fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
          hideExpandedCounter: true, // Hide counter badge if parent is expanded
          hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
          highlight: true, // Highlight matches by wrapping inside <mark> tags
          leavesOnly: false, // Match end nodes only
          nodata: true, // Display a 'no data' status node if result is empty
          // dimm
          mode: 'hide', // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
        },
        source: this.config().loadTreeData(),
        renderNode: function(event: any, data: any) {
          var node = data.node;
          console.log("%c Line:91 🥖", "color:#ffdd4d");
          var $span = $("<span>", {
              text: 111,
              class: "custom-node"
          });
          return $span;
        },
        // renderTitle: this.config().renderTitle,
        strings: {
          noData: '暂无数据',
          loading: '加载中...',
          loadError: '加载失败，请稍后再试',
          warning: '警告：操作可能不安全',
          appendCheckbox: '添加复选框',
          selectMode: '单选模式',
        },
        // init: function (event: any, data: any) {
        //   if (that.config().init) return that.config().init!(data);
        //   var tree = data.tree;
        //   var firstNode = tree.getRootNode().children[0]; // 获取根节点的第一个子节点
        //   if (firstNode && that.config().isDefaultFirst) {
        //     firstNode.setSelected(true); // 设置选中状态
        //   }
        // },
        childcounter: {
          deep: true,
          hideZeros: true,
          hideExpanded: true,
        },
        // autoScroll: false,
        // generateIds: true,
        // quicksearch: true,
        dnd5: {
          preventVoidMoves: true, // Prevent moving nodes 'before self', etc.
          preventRecursion: true, // Prevent dropping nodes on own descendants
          preventSameParent: false, // Prevent dropping nodes under the same direct parent
          autoExpandMS: 1000,
          multiSource: true, // drag all selected nodes (plus current node)
          // focusOnClick: true,
          // refreshPositions: true,
          dragStart: function (node: any, data: any) {
            // allow dragging `node`:
            data.effectAllowed = 'all';
            data.dropEffect = data.dropEffectSuggested; //"link";
            // data.dropEffect = "move";
            return true;
          },
          dragDrag: function(node: any, data: any) {
            data.node.info("dragDrag", data);
            data.dropEffect = "copy";
            return true;
          },
          dragEnter: function (node: any, data: any) {
            data.node.info('dragEnter', data);
            // data.dropEffect = "link";
            return true;
          },
          dragOver: function (node: any, data: any) {
            // data.node.info("dragOver", data: any);
            data.dropEffect = data.dropEffectSuggested; //"link";
            return true;
          },
          dragEnd: function (node: any, data: any) {
            data.node.info('dragEnd', data);
          },
          dragDrop: function (node: any, data: any) {
            var sourceNodes = data.otherNodeList,
              copyMode = data.dropEffect !== 'move';

            if (data.hitMode === 'after') {
              // If node are inserted directly after tagrget node one-by-one,
              // this would reverse them. So we compensate:
              sourceNodes.reverse();
            }
            if (copyMode) {
              $.each(sourceNodes, function (i: any, o: any) {
                o.info('copy to ' + node + ': ' + data.hitMode);
                o.copyTo(node, data.hitMode, function (n: any) {
                  delete n.key;
                  n.selected = false;
                  n.title = 'Copy of ' + n.title;
                });
              });
            } else {
              $.each(sourceNodes, function (i: any, o: any) {
                o.info('move to ' + node + ': ' + data.hitMode);
                o.moveTo(node, data.hitMode);
              });
            }
            node.debug('drop', data);
            node.setExpanded();
          },
        },
        click: (event: any, data: any) => {
          const { ctrlKey, shiftKey, altKey } = event;
          const node = data.node;
          if (node.isEditing() && !ctrlKey && !shiftKey && !altKey) return true;
          node.toggleExpanded();
          return true;
        },
        edit: {
          triggerStart: [
            // 'clickActive',
            // 'dblclick',
            'f2',
            'mac+enter',
            'enter',
            // 'shift+click',
          ],
          beforeEdit: function (event: any, data: any) {
            // Return false to prevent edit mode
          },
          edit: function (event: any, data: any) {
            // Editor was opened (available as data.input)
            console.log('edit...', this, data);
          },
          beforeClose: function (event: any, data: any) {
            // Return false to prevent cancel/save (data.input is available)
            if (data.originalEvent.type === 'mousedown') {
              // We could prevent the mouse click from generating a blur event
              // (which would then again close the editor) and return `false` to keep
              // the editor open:
              //                  data.originalEvent.preventDefault();
              //                  return false;
              // Or go on with closing the editor, but discard any changes:
              //                  data.save = false;
            }
          },
          save: function (event: any, data: any) {
            // Save data.input.val() or return false to keep editor open
            console.log('save...', this, data.node);
            // Simulate to start a slow ajax request...

            // setTimeout(() => {
            //   that.config().addNodeEvent?.(data);
            //   $(data.node.span).removeClass('pending');
            //   // Let's pretend the server returned a slightly modified
            //   // title:
            //   // data.node.setTitle(data.node.title + '!');
            // }, 100);
            // We return true, so ext-edit will set the current user input
            // as title
            return true;
          },
          remove: function (event: any, data: any) {
            return true;
          },
          close: function (event: any, data: any) {
            // Editor was removed
            if (data.save) {
              // Since we started an async request, mark the node as preliminary
              $(data.node.span).addClass('pending');
            }
          },
        },
        glyph: {
          preset: "bootstrap3",
          map: {
          //   // 普通节点图标（未展开）
          //   doc: "fa fa-file", // 默认的文件图标，用于普通节点
          //   // 普通节点图标（已展开）
          //   docOpen: "fa fa-file", // 已展开的文件图标，通常与 `doc` 保持一致
          //   // 复选框图标（未选中）
          //   checkbox: "fa fa-square-o", // 未选中的复选框
          //   // 复选框图标（选中）
          //   checkboxSelected: "fa fa-check-square-o", // 选中的复选框
          //   // 复选框图标（不确定状态）
          //   checkboxUnknown: "fa fa-minus-square-o", // 不确定状态的复选框（例如子节点部分选中）
          //   // 拖拽辅助图标
          //   dragHelper: "fa fa-arrows", // 拖拽时显示的辅助图标
          //   // 拖拽目标标记图标
          //   dropMarker: "fa fa-arrow-right", // 拖拽目标位置的标记图标
          //   // 错误图标
          //   error: "fa fa-exclamation-triangle", // 表示错误或警告的图标
          //   // 未展开的展开器图标
          //   expanderClosed: "fa fa-chevron-right", // 未展开的节点展开器（向右箭头）
          //   // 懒加载的展开器图标
          //   expanderLazy: "fa fa-chevron-right", // 懒加载节点的展开器（向右箭头）
          //   // 已展开的展开器图标
          //   expanderOpen: "fa fa-chevron-down", // 已展开的节点展开器（向下箭头）
          //   // 文件夹图标（未展开）
          //   folder: "fa fa-folder", // 默认的文件夹图标
          //   // 文件夹图标（已展开）
          //   folderOpen: "fa fa-folder-open", // 已展开的文件夹图标
          //   // 加载中的图标
          //   loading: "fa fa-refresh fa-spin", // 表示加载中的动画图标
          //   // 默认节点图标
          //   node: "fa fa-circle-o" // 默认的节点图标，用于没有指定图标的节点
          }
        },
        // @ts-ignore
        icon(event, data) {
          // For the sake of this example set specific icons in different ways.
          //
          switch( data.node.title ) {
            case "Art of War":
              // Insert an SVG reference to an SVG symbol (defined below)
              return { html: '<svg><use xlink:href="#svg-android-black"></use></svg>' };
            case "The Hobbit":
              // Insert an <i> tag that will be replaced with an inline SVG graphic
              // by Font Awesome's all.js library.
              // Note: We DON'T want this, since it will be slow for large trees!
              return { html: '<i class="fas fa-book"></i>' };
            case "The Little Prince":
              // Here we use Font Awesome's auto conversion (as above), to create the
              // <i> tags that where created separately below.
              // The nodes nodes contain inline tags that reference those icons:
              return { html: '<svg class="fa-spin"><use xlink:href="#fas-fa-circle-notch"></use></svg>' };
          }
        },
        wide: {
          iconWidth: "1em",       // Adjust this if @fancy-icon-width != "16px"
          iconSpacing: "0.5em",   // Adjust this if @fancy-icon-spacing != "3px"
          labelSpacing: "0.1em",  // Adjust this if padding between icon and label != "3px"
          levelOfs: "1.5em"       // Adjust this if ul padding != "16px"
        },  
        select: function (event: any, data: any) {
          // that.config().defaultSelectNodeEvent?.(data);
        },
        lazyLoad: (event: any, data: any) => {
          data.result = {
            title: '延迟加载节点',
            key: '3',
          };
        },
        createNode: function (event: any, data: any) {
          var node = data.node,
            $tdList = $(node.tr).find('>td');

          // Span the remaining columns if it's a folder.
          // We can do this in createNode instead of renderColumns, because
          // the `isFolder` status is unlikely to change later
          if (node.isFolder()) {
            $tdList.eq(2).prop('colspan', 6).nextAll().remove();
          }
        },
        renderColumns: function (event: any, data: any) {
          var node = data.node,
            $tdList = $(node.tr).find('>td');

          // (Index #0 is rendered by fancytree by adding the checkbox)
          // Set column #1 info from node data:
          $tdList.eq(1).text(node.getIndexHier());
          // (Index #2 is rendered by fancytree)
          // Set column #3 info from node data:
          $tdList.eq(3).find('input').val(node.key);
          $tdList.eq(4).find('input').val(node.data.foo);

          // Static markup (more efficiently defined as html row template):
          // $tdList.eq(3).html("<input type='input' value='"  "" + "'>");
          // ...
        },
        modifyChild: function (event: any, data: any) {
          if (data.operation === 'remove') {
            // that.config().deleteNodeEvent?.(data.childNode.data.id);
          }
          data.tree.info(event.type, data);
        },
        contextMenu: {
          menu: {
            items: {
              rename: { name: '重命名', icon: 'edit' },
              delete: { name: '删除', icon: 'delete' },
              addChild: { name: '添加子节点', icon: 'add' },
            },
          },
          actions: (node: any, action: any) => {
            switch (action) {
              case 'rename':
                node.editStart();
                break;
              case 'delete':
                node.remove();
                break;
              case 'addChild':
                node.addChildren({ title: 'New Node' });
                break;
            }
          },
        },
      })
      .on('nodeCommand', function (event: any, data: any) {
        // Custom event handler that is triggered by keydown-handler and
        // context menu:
        var refNode,
          moveMode,
          // @ts-ignore
          tree = $.ui.fancytree.getTree(this),
          node = tree.getActiveNode();

        switch (data.cmd) {
          case 'addChild':
          case 'addSibling':
          case 'indent':
          case 'moveDown':
          case 'moveUp':
          case 'outdent':
          case 'remove':
          case 'rename':
            tree.applyCommand(data.cmd, node);
            break;
          case 'cut':
            CLIPBOARD = { mode: data.cmd, data: node };
            break;
          case 'copy':
            CLIPBOARD = {
              mode: data.cmd,
              data: node.toDict(true, function (dict: any, node: any) {
                delete dict.key;
              }),
            };
            break;
          case 'clear':
            CLIPBOARD = null;
            break;
          case 'paste':
            if (CLIPBOARD.mode === 'cut') {
              // refNode = node.getPrevSibling();
              CLIPBOARD.data.moveTo(node, 'child');
              CLIPBOARD.data.setActive();
            } else if (CLIPBOARD.mode === 'copy') {
              node.addChildren(CLIPBOARD.data).setActive();
            }
            break;
          default:
            alert('Unhandled command: ' + data.cmd);
            return;
        }
      })
      // @ts-ignore
      .on('keydown', function (e: any) {
        var cmd = null;

        // console.log(e.type, $.ui.fancytree.eventToString(e));
        switch ($.ui.fancytree.eventToString(e)) {
          case 'ctrl+shift+n':
          case 'meta+shift+n': // mac: cmd+shift+n
            cmd = 'addChild';
            return;
            break;
          case 'ctrl+c':
          case 'meta+c': // mac
            cmd = 'copy';
            break;
          case 'ctrl+v':
          case 'meta+v': // mac
            cmd = 'paste';
            break;
          case 'ctrl+x':
          case 'meta+x': // mac
            cmd = 'cut';
            break;
          case 'ctrl+n':
          case 'meta+n': // mac
            cmd = 'addSibling';
            break;
          case 'del':
          case 'meta+backspace': // mac
            cmd = 'remove';
            break;
          // case "f2":  // already triggered by ext-edit pluging
          //   cmd = "rename";
          //   break;
          case 'ctrl+up':
          case 'ctrl+shift+up': // mac
            cmd = 'moveUp';
            break;
          case 'ctrl+down':
          case 'ctrl+shift+down': // mac
            cmd = 'moveDown';
            break;
          case 'ctrl+right':
          case 'ctrl+shift+right': // mac
            cmd = 'indent';
            break;
          case 'ctrl+left':
          case 'ctrl+shift+left': // mac
            cmd = 'outdent';
        }
        if (cmd) {
          // @ts-ignore
          $(this).trigger('nodeCommand', { cmd: cmd });
          return false;
        }
      });

    $('#hs-fancytree').contextmenu({
      delegate: 'span.fancytree-node',
      menu: [
        {
          title: '编辑 <kbd>[F2]</kbd>',
          cmd: 'rename',
          uiIcon: 'ui-icon-pencil',
        },
        {
          title: '删除 <kbd>[Del]</kbd>',
          cmd: 'remove',
          uiIcon: 'ui-icon-trash',
        },
        { title: '----' },
        {
          title: '新文件 <kbd>[Ctrl+N]</kbd>',
          cmd: 'addSibling',
          uiIcon: 'ui-icon-plus',
        },
        {
          title: '新子文件 <kbd>[Ctrl+Shift+N]</kbd>',
          cmd: 'addChild',
          uiIcon: 'ui-icon-arrowreturn-1-e',
          disabled: true,
        },
        { title: '----' },
        {
          title: '剪切 <kbd>Ctrl+X</kbd>',
          cmd: 'cut',
          uiIcon: 'ui-icon-scissors',
        },
        {
          title: '复制 <kbd>Ctrl-C</kbd>',
          cmd: 'copy',
          uiIcon: 'ui-icon-copy',
        },
        {
          title: '粘贴<kbd>Ctrl+V</kbd>',
          cmd: 'paste',
          uiIcon: 'ui-icon-clipboard',
          disabled: true,
        },
      ],
      beforeOpen: function (event: any, ui: any) {
        var node = $.ui.fancytree.getNode(ui.target);
        $('#tree').contextmenu('enableEntry', 'paste', !!CLIPBOARD);
        node.setActive();
      },
      select: (event: any, ui: any) => {
        setTimeout(() => {
          $('#hs-fancytree').trigger('nodeCommand', { cmd: ui.cmd });
        }, 100);
      },
    });

    this.treeInstance = $('#hs-fancytree').fancytree('getTree');
  }

  initFancytreeFilter() {
    this.fileName.valueChanges
      .pipe(debounceTime(300)) // 设置节流时间为500ms
      .subscribe((value: any) => {
        const match = value.trim();

        if (match === '') {
          // 如果输入框为空，重置过滤
          this.treeInstance.clearFilter();
          this.filterCount = 0;
          return;
        }

        // 执行过滤操作
        const n = this.treeInstance.filterBranches.call(
          this.treeInstance,
          match,
          {
            autoExpand: true, // 自动展开包含匹配节点的父节点
            highlight: true, // 高亮显示匹配的文本
          },
        );

        // 更新过滤数量
        this.filterCount = n;
      });
  }
}
