import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';

declare var $: any;

@Component({
  selector: 'hs-tree',
  templateUrl: './hs-tree.component.html',
  styleUrls: ['./hs-tree.component.less']
})
export class HsTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('jsTreeContainer', { static: false }) jstreeContainer: ElementRef;

  constructor(private scriptLoaderService: ScriptLoaderService) { }


  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.scriptLoaderService
      .loadScripts([
        'jquery.min.js',
        'jstree.min.js',
      ])
      .subscribe({
        next: () => {
          this.initJstree();
        },
        error: (error) => console.error('Error loading script:', error),
        // complete: () => this.initFancytree(),
      });

    this.initJsTreeFilter();
  }

  initJstree() {
    const data = [
      {
        text: 'Root node',
        children: [
          {
            text: 'Child node 1'
          },
          {
            text: 'Child node 2'
          }
        ]
      },
      {
        text: 'Root node',
        children: [
          {
            text: 'Child node 1'
          },
          {
            text: 'Child node 2'
          }
        ]
      }
    ];

    const jstreeInstance = $(this.jstreeContainer.nativeElement).jstree({
      core: {
        "animation": 0,
        "check_callback": true,
        "themes": { "stripes": true },
        data: data
      },
      "contextmenu": {
        "items": function ($node: any) {
          return {
            "rename": {
              "separator_before": false,
              "separator_after": false,
              "label": "重命名",
              "action": function (obj: any) {
                // 触发重命名操作
                $("#jstree").jstree(true).rename_node($node);
              }
            },
            "delete": {
              "separator_before": false,
              "separator_after": false,
              "label": "删除",
              "action": function (obj: any) {
                // 触发删除操作
                $("#jstree").jstree(true).delete_node($node);
              }
            },
            "create": {
              "separator_before": false,
              "separator_after": false,
              "label": "创建子节点",
              "action": function (obj: any) {
                // 触发创建子节点操作
                $("#jstree").jstree(true).create_node($node);
              }
            },
            "custom": {
              "separator_before": false,
              "separator_after": false,
              "label": "自定义操作",
              "action": function (obj: any) {
                // 自定义操作逻辑
                alert("执行自定义操作");
              }
            }
          };
        }
      },
      "plugins": [
        "contextmenu", "dnd", "search",
        "state", "types", "wholerow"
      ]
    });

    // 绑定事件监听
    jstreeInstance.on('changed.jstree', (e: Event, data: any) => {
      console.log('Node selected:', data.selected);
    });
  }

  initJsTreeFilter() {

  }

}
