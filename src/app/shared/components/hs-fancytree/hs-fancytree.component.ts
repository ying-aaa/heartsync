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
    $('#hs-fancytree').fancytree({
      extensions: ['dnd', 'edit'],
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
      dnd: {
        autoExpandMS: 400,
        focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
        dragStart: function (node: any, data: any) {
          /** This function MUST be defined to enable dragging for the tree.
           *  Return false to cancel dragging of node.
           */
          return true;
        },
        dragEnter: function (node: any, data: any) {
          return true;
        },
        dragDrop: function (node: any, data: any) {
          /** This function MUST be defined to enable dropping of items on
           *  the tree.
           */
          data.otherNode.moveTo(node, data.hitMode);
        },
      },
      activate: function (event: any, data: any) {
        //        alert("activate " + data.node);
      },
      lazyLoad: (event: any, data: any) => {
        data.result = {
          title: 'Lazy Loaded Node',
          key: '3',
        };
      },
    });
  }
}
