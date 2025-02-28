// @ts-nocheck
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';

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
  fileName = new FormControl('');

  filterCount = 0;

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.scriptLoaderService
      .loadScripts([
        'jquery.min.js',
        'jquery-ui.min.js',
        'jquery.ui-contextmenu.min.js',
        'jquery.fancytree-all.min.js',
      ])
      .subscribe({
        next: () => this.initFancytree(),
        error: (error) => console.error('Error loading script:', error),
        // complete: () => this.initFancytree(),
      });

    this.initFancytreeFilter();
  }

  initFancytree() {
    let CLIPBOARD: { mode: any; data: any } | null = null;

    $('#hs-fancytree')
      .fancytree({
        extensions: ['dnd5', 'edit', 'multi', 'childcounter', 'filter'],
        checkbox: true,
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
        source: [
          {
            title: 'Node 1',
            key: '1',
            folder: true,
            children: [
              { title: 'Node 1.1', key: '1.1' },
              { title: 'Node 1.2', key: '1.2' },
            ],
          },
          { title: 'Node 2', key: '2' },
        ],
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
          dragStart: function (node, data) {
            // allow dragging `node`:
            data.effectAllowed = 'all';
            data.dropEffect = data.dropEffectSuggested; //"link";
            // data.dropEffect = "move";
            return true;
          },
          // dragDrag: function(node, data) {
          //   data.node.info("dragDrag", data);
          //   data.dropEffect = "copy";
          //   return true;
          // },
          dragEnter: function (node, data) {
            data.node.info('dragEnter', data);
            // data.dropEffect = "link";
            return true;
          },
          dragOver: function (node, data) {
            // data.node.info("dragOver", data);
            data.dropEffect = data.dropEffectSuggested; //"link";
            return true;
          },
          dragEnd: function (node, data) {
            data.node.info('dragEnd', data);
          },
          dragDrop: function (node, data) {
            var sourceNodes = data.otherNodeList,
              copyMode = data.dropEffect !== 'move';

            if (data.hitMode === 'after') {
              // If node are inserted directly after tagrget node one-by-one,
              // this would reverse them. So we compensate:
              sourceNodes.reverse();
            }
            if (copyMode) {
              $.each(sourceNodes, function (i, o) {
                o.info('copy to ' + node + ': ' + data.hitMode);
                o.copyTo(node, data.hitMode, function (n) {
                  delete n.key;
                  n.selected = false;
                  n.title = 'Copy of ' + n.title;
                });
              });
            } else {
              $.each(sourceNodes, function (i, o) {
                o.info('move to ' + node + ': ' + data.hitMode);
                o.moveTo(node, data.hitMode);
              });
            }
            node.debug('drop', data);
            node.setExpanded();
          },
        },
        click: (event, data) => {
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
          },
          beforeClose: function (event: any, data: any) {
            // Return false to prevent cancel/save (data.input is available)
            console.log(event.type, event, data);
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
            console.log('save...', this, data);
            // Simulate to start a slow ajax request...
            setTimeout(function () {
              $(data.node.span).removeClass('pending');
              // Let's pretend the server returned a slightly modified
              // title:
              data.node.setTitle(data.node.title + '!');
            }, 2000);
            // We return true, so ext-edit will set the current user input
            // as title
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
        lazyLoad: (event: any, data: any) => {
          data.result = {
            title: 'Lazy Loaded Node',
            key: '3',
          };
        },
        createNode: function (event, data) {
          var node = data.node,
            $tdList = $(node.tr).find('>td');

          // Span the remaining columns if it's a folder.
          // We can do this in createNode instead of renderColumns, because
          // the `isFolder` status is unlikely to change later
          if (node.isFolder()) {
            $tdList.eq(2).prop('colspan', 6).nextAll().remove();
          }
        },
        renderColumns: function (event, data) {
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
        modifyChild: function (event, data) {
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
          actions: (node, action) => {
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
      .on('nodeCommand', function (event, data) {
        // Custom event handler that is triggered by keydown-handler and
        // context menu:
        var refNode,
          moveMode,
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
              data: node.toDict(true, function (dict, node) {
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
      .on('keydown', function (e) {
        var cmd = null;

        // console.log(e.type, $.ui.fancytree.eventToString(e));
        switch ($.ui.fancytree.eventToString(e)) {
          case 'ctrl+shift+n':
          case 'meta+shift+n': // mac: cmd+shift+n
            cmd = 'addChild';
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
      beforeOpen: function (event, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        $('#tree').contextmenu('enableEntry', 'paste', !!CLIPBOARD);
        node.setActive();
      },
      select: function (event, ui) {
        var that = this;
        // delay the event, so the menu can close and the click event does
        // not interfere with the edit control
        setTimeout(function () {
          $(that).trigger('nodeCommand', { cmd: ui.cmd });
        }, 100);
      },
    });
  }

  initFancytreeFilter() {
    this.fileName.valueChanges
      .pipe(debounceTime(300)) // 设置节流时间为500ms
      .subscribe((value: any) => {
        const tree = $('#hs-fancytree').fancytree('getTree');
        const match = value.trim();

        if (match === '') {
          // 如果输入框为空，重置过滤
          tree.clearFilter();
          this.filterCount = 0;
          return;
        }

        // 执行过滤操作
        const n = tree.filterBranches.call(tree, match, {
          autoExpand: true, // 自动展开包含匹配节点的父节点
          highlight: true, // 高亮显示匹配的文本
        });

        // 更新过滤数量
        this.filterCount = n;
      });
  }
}
