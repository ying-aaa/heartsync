import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Graph, Shape } from '@antv/x6';
import { Scroller } from '@antv/x6-plugin-scroller';
import { MiniMap } from '@antv/x6-plugin-minimap';
import '@antv/x6-plugin-dnd';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Rect, Circle } from '@antv/x6/lib/shape';
import { nodeConfigs } from './nodes.config';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Dnd } from '@antv/x6-plugin-dnd';

@Component({
  selector: 'hs-node-editor',
  templateUrl: './node-editor.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('x6Container') x6Container!: ElementRef;
  @ViewChild('stencilContainer') stencilContainer!: ElementRef;
  @ViewChild('minimapContainer') minimapContainer!: ElementRef;

  accordion = viewChild.required(MatAccordion);

  nodeConfigs = nodeConfigs;

  graph: Graph;
  dnd: Dnd;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.accordion().openAll();
    }, 200);
    this.graph = new Graph({
      container: this.x6Container.nativeElement,
      // width: 800,
      // height: "100%",
      panning: {
        enabled: true,
        modifiers: 'shift',
      },
      background: {
        // color: '#fffbe6', // 设置画布背景颜色
      },
      grid: {
        size: 10, // 网格大小 10px
        visible: true, // 渲染网格背景
      },
    });

    this.graph.use(
      new Scroller({
        // enabled: true,
        pannable: true, // 允许拖拽空白处平移
      }),
    );

    this.graph.use(
      new MiniMap({
        container: document.getElementById('minimap-container')!, // 你的缩略图 DOM
        width: 300,
        height: 200,
      }),
    );

    // -------------------------------------------------------------------------------------

    const stencil = new Stencil({
      // title: 'Components',
      target: this.graph, // 绑定目标画布
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1;
      },
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 0,
      groups: nodeConfigs.map((group) => ({
        name: group.key,
        title: group.title,
        key: group.key,
      })),
    });

    this.dnd = new Dnd({
      target: this.graph,
      scaled: false,
      dndContainer: this.stencilContainer.nativeElement,
    });

    // this.stencilContainer.nativeElement.appendChild(stencil.container);

    nodeConfigs.forEach((group) => {
      const nodes = group.nodes.map((node) =>
        this.graph.createNode({
          shape: 'rect',
          width: 70,
          height: 40,
          key: node.key,
          attrs: {
            rect: { fill: '#fff', stroke: '#4B4A67', strokeWidth: 1 },
            text: { text: 'rect', fill: '#000' },
          },
        }),
      );
      stencil.load(nodes, group.key);
    });

    // graph.zoom(0.8);
    this.graph.translate(80, 40);
  }

  startDrag = (e: any) => {
    const target = e.currentTarget;
    const nodeKey = target.getAttribute('node-key');
    console.log('%c Line:138 🍉 key', 'color:#7f2b82', nodeKey);
    const node = this.graph.createNode({
      width: 100,
      height: 40,
      label: 'Rect',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    });

    this.dnd.start(node, e);
  };

  ngOnInit() {}
}
