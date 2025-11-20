import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
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
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { FormlyFormOptions } from '@ngx-formly/core';

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
          position: { name: 'top' },
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        right: {
          position: { name: 'right' },
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
          position: { name: 'bottom' },
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        left: {
          position: { name: 'left' },
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
    FormlyConfigComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('x6Container') x6Container!: ElementRef;
  @ViewChild('stencilContainer') stencilContainer!: ElementRef;
  @ViewChild('minimapContainer') minimapContainer!: ElementRef;

  context = input({
    variable: {},
    formilyFields: [[]],
  });

  accordion = viewChild.required(MatAccordion);

  nodeConfigs = nodeConfigs;

  graph: Graph;
  dnd: Dnd;

  configType = 'componentAction';
  model = {};
  options: FormlyFormOptions = {
    formState: {
      variable: {},
      formilyFields: [
        {
          name: '所属应用ID',
          key: 'appId',
          id: 'input_key_2579558739748954',
          type: 'input',
        },
        {
          name: '数据源名称',
          key: 'name',
          id: 'input_key_4363196823490257',
          type: 'input',
        },
        {
          name: '主机地址',
          key: 'host',
          id: 'input_key_0293012594679814',
          type: 'input',
        },
        {
          name: '用户名',
          key: 'username',
          id: 'input_key_0398187333438150',
          type: 'input',
        },
        {
          name: '数据库名称',
          key: 'database',
          id: 'input_key_8308507291481975',
          type: 'input',
        },
        {
          name: '连接池最大连接数',
          key: 'maxPoolCount',
          id: 'input_key_4025131062342067',
          type: 'input',
        },
        {
          name: '数据源类型',
          key: 'type',
          id: 'select_key_4564575816260138',
          type: 'select',
        },
        {
          name: '端口',
          key: 'port',
          id: 'input_key_1962228540476969',
          type: 'input',
        },
        {
          name: '密码',
          key: 'password',
          id: 'input_key_9100159250090693',
          type: 'input',
        },
        {
          name: '连接超时时间（秒）',
          key: 'timeout',
          id: 'input_key_1418836004434089',
          type: 'input',
        },
        {
          name: '连接池最大连接数',
          key: 'minPoolCount',
          id: 'input_key_6091916310062948',
          type: 'input',
        },
      ].map((item) => ({ ...item, label: item.name, value: item.key })),
    },
  };

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
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
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
            padding: 7,
            attrs: {
              stroke: '#31d0c6',
              fill: '#31d0c6',
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#31d0c6',
              stroke: '#31d0c6',
              strokeWidth: 1,
              r: 10,
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

    this.dnd = new Dnd({
      target: this.graph,
      scaled: false,
      dndContainer: this.stencilContainer.nativeElement,
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

    this.graph.on('edge:mouseup', (e) => {
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
    // 设置颜色
    node.portProp(port, 'attrs/circle/stroke', circleR > 5 ? '#31d0c6' : '#8f8f8f');
    // 填充颜色
    node.portProp(port, 'attrs/circle/fill', circleR > 5 ? '#31d0c6' : '#fff');
  }

  ngOnInit() {}

  ngOnDestroy() {
    // 注销所用监听
    this.graph.off();
    this.graph.dispose();
  }
}
