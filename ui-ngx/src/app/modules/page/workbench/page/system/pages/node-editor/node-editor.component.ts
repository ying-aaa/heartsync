import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Graph, Shape } from '@antv/x6';
import { Scroller } from '@antv/x6-plugin-scroller';
import { MiniMap } from '@antv/x6-plugin-minimap';
import '@antv/x6-plugin-dnd';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Rect, Circle } from '@antv/x6/lib/shape';

@Component({
  selector: 'hs-node-editor',
  templateUrl: './node-editor.component.html',
})
export class NodeEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('x6Container') x6Container!: ElementRef;
  @ViewChild('stencilContainer') stencilContainer!: ElementRef;
  @ViewChild('minimapContainer') minimapContainer!: ElementRef;

  data = {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        shape: 'rect', // 使用 rect 渲染
        x: 40, // Number，必选，节点位置的 x 值
        y: 40, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        shape: 'ellipse', // 使用 ellipse 渲染
        x: 160, // Number，必选，节点位置的 x 值
        y: 180, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'world', // String，节点标签
      },
    ],
    // 边
    edges: [
      {
        source: 'node1', // String，必须，起始节点 id
        target: 'node2', // String，必须，目标节点 id
      },
    ],
  };

  constructor() {}

  ngAfterViewInit(): void {
    const graph = new Graph({
      container: this.x6Container.nativeElement,
      width: 800,
      height: 600,
      panning: {
        enabled: true,
        modifiers: 'shift',
      },
      background: {
        color: '#fffbe6', // 设置画布背景颜色
      },
      grid: {
        size: 10, // 网格大小 10px
        visible: true, // 渲染网格背景
      },
    });

    graph.use(
      new Scroller({
        enabled: true,
        pannable: true, // 允许拖拽空白处平移
      }),
    );

    graph.use(
      new MiniMap({
        container: document.getElementById('minimap-container')!, // 你的缩略图 DOM
        width: 400,
        height: 200,
      }),
    );

    // -------------------------------------------------------------------------------------

    const stencil = new Stencil({
      title: 'Components',
      target: graph, // 绑定目标画布
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1;
      },
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 0,
      groups: [
        { name: 'group1', title: 'Group(Collapsable)' },
        { name: 'group2', title: 'Group', collapsable: false },
      ],
    });

    this.stencilContainer.nativeElement.appendChild(stencil.container);

    const r = graph.createNode({
      shape: 'rect',
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    });

    const c = graph.createNode({
      shape: 'circle',
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    });

    const c2 = graph.createNode({
      shape: 'circle',
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    });

    const r2 = graph.createNode({
      shape: 'rect',
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    });

    const r3 = graph.createNode({
      shape: 'rect',
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    });

    const c3 = graph.createNode({
      shape: 'circle',
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    });

    stencil.load([r, c, c2, r2.clone()], 'group1');
    stencil.load([c2.clone(), r2, r3, c3], 'group2');

    graph.zoom(0.8);
    graph.translate(80, 40);
  }

  ngOnInit() {}
}
