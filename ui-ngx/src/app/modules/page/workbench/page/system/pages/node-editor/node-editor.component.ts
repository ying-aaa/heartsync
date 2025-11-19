import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Graph } from '@antv/x6';
import { Scroller } from '@antv/x6-plugin-scroller';
import { MiniMap } from '@antv/x6-plugin-minimap';
import '@antv/x6-plugin-dnd';
import { Stencil } from '@antv/x6-plugin-stencil';
import { nodeConfigs } from './nodes.config';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Dnd } from '@antv/x6-plugin-dnd';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { PortManager } from '@antv/x6/lib/model/port';

Graph.registerNode(
  'custom-node-with-port',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
    },
  },
  true,
);

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
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('x6Container') x6Container!: ElementRef;
  @ViewChild('stencilContainer') stencilContainer!: ElementRef;
  @ViewChild('minimapContainer') minimapContainer!: ElementRef;

  accordion = viewChild.required(MatAccordion);

  nodeConfigs = nodeConfigs;

  graph: Graph;
  dnd: Dnd;

  constructor(public dialog: MatDialog) {}

  viewCode(): void {
    const dialogRef = this.dialog.open(HsCodeComponent, {
      data: {
        code: this.getJson.bind(this),
        minHeight: '80vh',
      },
      minWidth: '1200px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getJson() {
    return JSON.stringify(this.graph.toJSON(), null, 2);
  }

  startDrag = (e: any, nodeConfig: any) => {
    const location = ['top', 'right', 'bottom', 'left'];
    const ports: PortManager.Metadata = {
      groups: {},
      items: [],
    };
    location.forEach((direction) => {
      ports.groups![direction] = {
        position: {
          name: direction,
        },
        attrs: {
          circle: {
            style: {
              visibility: 'hidden', // 默认隐藏
            },
          },
        },
      };
      ports.items.push({
        id: direction,
        group: direction,
      });
    });
    const node = this.graph.createNode({
      shape: 'custom-node-with-port',
      width: 100,
      height: 40,
      label: nodeConfig.title,
      ports,
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
      connecting: {
        allowBlank: false,
        allowMulti: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowPort: true,
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          });
        },
        router: {
          name: 'manhattan',
          args: {
            startDirections: ['top', 'right', 'bottom', 'left'],
            endDirections: ['top', 'right', 'bottom', 'left'],
          },
        },
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 12,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 1,
            },
          },
        },
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

    // -------------------------------------------------------------------------------------

    // graph.zoom(0.8);
    this.graph.translate(80, 40);
    //节点移入移出
    this.graph.on('node:mouseenter', (e) => this.toggleNodePorts(e, 'visible'));
    this.graph.on('node:mouseleave', (e) => this.toggleNodePorts(e, 'hidden'));
    // 连接桩移入移出
    this.graph.on('node:port:mouseenter', (e) => this.scalePort(e, 10));
    this.graph.on('node:port:mouseleave', (e) => this.scalePort(e, 5));

    // 连接桩拉出结束
    this.graph.on('edge:mousedown', ({ edge }) => {
      // 显示所有节点的连接桩
      this.graph.getNodes().forEach((node) => {
        this.toggleNodePorts({ node }, 'visible');
      });
    });

    this.graph.on('edge:mouseup', () => {
      // 隐藏所有节点的连接桩
      this.graph.getNodes().forEach((node) => {
        this.toggleNodePorts({ node }, 'hidden');
      });
    });
  }

  toggleNodePorts(e: any, v: 'visible' | 'hidden') {
    const node = e.node; // 当前节点
    const ports = node.getPorts() || []; // 该节点所有 port 配置
    ports.forEach((port: any) => {
      node.setPortProp(port.id, 'attrs/circle/style/visibility', v);
      if (v === 'hidden') this.scalePort({ ...e, port }, 5);
    });
  }

  scalePort(e: any, circleR: number) {
    const { node, port } = e;
    node.portProp(port, 'attrs/circle/r', circleR);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.graph.dispose();
  }
}
