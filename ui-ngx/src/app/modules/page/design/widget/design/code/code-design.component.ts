import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AceEditorComponent } from '@src/app/shared/components/ace-editor/ace-editor.component';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CodeToolbarComponent } from './code-toolbar/code-toolbar.component';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { WidgetCodeComponent } from '@src/app/modules/components/widget-code/widget-code.component';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'hs-code-design',
  templateUrl: './code-design.component.html',
  styleUrls: ['./code-design.component.less'],
  imports: [
    AceEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    SplitAreaComponent,
    SplitComponent,
    CodeToolbarComponent,
    FormlyRunModule,
    PortalModule,
    WidgetCodeComponent,
  ],
})
export class CodeDesignComponent implements OnInit, AfterViewInit {
  @ViewChild('WidgetCode') WidgetCode: WidgetCodeComponent;

  @HostBinding('class') class = 'split-example-page';
  hsCustomComponent: ComponentPortal<any> | undefined;

  model = {};

  widgetInfo = {
    templateHtml: `自定义动态组件 
<div (click)='addCount()' class='header'>111{{count}}</div>
@if(count >= 5) {
  <div>当前count 为 {{count}}</div>
}

<div id="chart-container"></div>
`,
    templateCss: `.header{
  background-color: green;
  cursor: pointer;
}

#chart-container{
  width: 400px;
  height: 300px;
  margin-left: 50px;
}`,
    templateJs: `return class extends DynamicWidgetComponent  {
  count = 0;
  addCount() {
    this.count++;
    console.log("$", $);
    console.log("echarts", echarts);
  }
  
  initEcharts() {
    console.log(1,2,3);
    var chart = echarts.init(document.getElementById('chart-container'));
  
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '月度销售额统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
            type: 'value',
            name: '销售额（万元）'
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: [120, 200, 150, 80, 70, 110],
            itemStyle: {
                color: '#5470c6'
            }
        }]
    };
  
    // 使用刚指定的配置项和数据显示图表
    chart.setOption(option);
  
    // 响应式调整图表大小
    window.addEventListener('resize', function() {
        chart.resize();
    });
  }
  
  ngOnInit() {
    this.initEcharts();
  }
}
`,
    resourceScript: [
      {
        resourceUrl:
          'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
      },
      { resourceUrl: 'jquery.min.js' },
    ],
  };

  fields = [
    {
      type: 'fieldset',
      props: {
        label: '外部资源地址配置',
        icon: 'subheader',
        styles: {
          fontSize: 14,
          fontSizeUnits: 'px',
          paddingTop: 8,
          paddingTopUnits: 'px',
        },
      },
      fieldGroup: [
        {
          key: 'resourceScript',
          type: 'array',
          props: {
            typeName: '普通输入子表',
            placeholder: '',
            disabled: false,
            styles: {
              borderWidth: 0,
              borderRadius: 0,
              borderColor: 'transparent',
            },
          },
          fieldId: 'subtable_key_6566596701791895',
          id: 'formly_25_subtable_6566596701791895_2',
          hooks: {},
          modelOptions: {},
          validation: {
            messages: {},
          },
          expressions: {},
          expressionProperties: {},
          className: 'hs-density--undefined ',
          fieldArray: {
            fieldGroup: [
              {
                key: 'resourceUrl',
                type: 'input',
                props: {
                  type: 'text',
                  label: '资源路径',
                  typeName: '单行文本',
                  placeholder: 'JavaScript/CSS URL',
                  disabled: false,
                  appearance: 'outline',
                  density: 5,
                  description: '',
                  required: false,
                  readonly: false,
                  row: 3,
                },
                isPlaceholder: true,
                className: 'hs-density--5 ',
              },
              {
                key: 'isModule',
                type: 'checkbox',
                defaultValue: false,
                props: {
                  label: '模块',
                  row: 1,
                  placeholder: '',
                  disabled: false,
                  appearance: 'outline',
                  density: 5,
                  description: '',
                  required: false,
                  readonly: false,
                },
                isPlaceholder: true,
                hooks: {},
                className: 'hs-density--5 ',
                focus: false,
              },
            ],
          },
        },
      ],
    },
  ];

  formGroup = new FormGroup({});

  action = {
    isVisibleA: true,
    isVisibleB: true,
    isVisibleC: true,
    isPresentA: true,
    isPresentB: true,
    isPresentC: true,
    logs: '',
  };

  log(eventName: any, e: any) {
    this.action.logs = `${new Date()}: ${eventName} > ${e}\n${this.action.logs}`;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  loadCustomComponent() {
    this.WidgetCode.loadResourceScript();
  }
}
