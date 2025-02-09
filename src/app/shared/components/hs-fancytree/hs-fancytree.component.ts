// @ts-nocheck
import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'hs-fancytree',
  templateUrl: './hs-fancytree.component.html',
  styleUrls: ['./hs-fancytree.component.less'],
})
export class HsFancytreeComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    let CLIPBOARD = null;

    $('#hs-fancytree')
      .fancytree({
        extensions: ['dnd5', 'edit', 'multi', 'childcounter'],
        checkbox: true,
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
            // This function MUST be defined to enable dropping of items on the tree.
            //
            // The source data is provided in several formats:
            //   `data.otherNode` (null if it's not a FancytreeNode from the same page)
            //   `data.otherNodeData` (Json object; null if it's not a FancytreeNode)
            //   `data.dataTransfer.getData()`
            //
            // We may access some meta data to decide what to do:
            //   `data.hitMode` ("before", "after", or "over").
            //   `data.dropEffect`, `.effectAllowed`
            //   `data.originalEvent.shiftKey`, ...
            //
            // Example:

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

    /*
     * Tooltips
     */
    // $("#tree").tooltip({
    //   content: function () {
    //     return $(this).attr("title");
    //   }
    // });

    /*
     * Context menu (https://github.com/mar10/jquery-ui-contextmenu)
     */
    $('#hs-fancytree').contextmenu({
      delegate: 'span.fancytree-node',
      menu: [
        {
          title: 'Edit <kbd>[F2]</kbd>',
          cmd: 'rename',
          uiIcon: 'ui-icon-pencil',
        },
        {
          title: 'Delete <kbd>[Del]</kbd>',
          cmd: 'remove',
          uiIcon: 'ui-icon-trash',
        },
        { title: '----' },
        {
          title: 'New sibling <kbd>[Ctrl+N]</kbd>',
          cmd: 'addSibling',
          uiIcon: 'ui-icon-plus',
        },
        {
          title: 'New child <kbd>[Ctrl+Shift+N]</kbd>',
          cmd: 'addChild',
          uiIcon: 'ui-icon-arrowreturn-1-e',
        },
        { title: '----' },
        {
          title: 'Cut <kbd>Ctrl+X</kbd>',
          cmd: 'cut',
          uiIcon: 'ui-icon-scissors',
        },
        {
          title: 'Copy <kbd>Ctrl-C</kbd>',
          cmd: 'copy',
          uiIcon: 'ui-icon-copy',
        },
        {
          title: 'Paste as child<kbd>Ctrl+V</kbd>',
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
}
