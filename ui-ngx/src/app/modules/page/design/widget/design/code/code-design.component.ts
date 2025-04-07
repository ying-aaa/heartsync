import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AceEditorComponent } from '@src/app/shared/components/ace-editor/ace-editor.component';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CodeToolbarComponent } from './code-toolbar/code-toolbar.component';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { WidgetCodeComponent } from '@src/app/modules/components/widget-code/widget-code.component';
import {
  ComponentPortal,
  PortalModule,
  PortalOutlet,
} from '@angular/cdk/portal';
import '@angular/compiler';

@Component({
  selector: 'hs-code-design',
  templateUrl: './code-design.component.html',
  styleUrls: ['./code-design.component.less'],
  imports: [
    AceEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SplitAreaComponent,
    SplitComponent,
    CodeToolbarComponent,
    FormlyRunModule,
    PortalModule,
    // WidgetCodeComponent,
  ],
})
export class CodeDesignComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'split-example-page';
  hsCustomComponent: ComponentPortal<any> | undefined;

  model = {};
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
          key: 'props.options',
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
                key: '5844141637878851',
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
                key: '8565278179065152',
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

  htmlCode = new FormControl(`自定义动态组件 
<div (click)='addCount()' class='header'>111{{count}}</div>
@if(count >= 5) {
  <div>当前count 为 {{count}}</div>
}
`);

  cssCode = new FormControl(`
.header{
  background-color: green;
  cursor: pointer;
}`);

  javascriptCode = new FormControl(`class customComponent {
  count = 0;
  addCount() {
    this.count++;
  }
}
`);

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

  ngAfterViewInit() {
    // this.loadCustomComponent();
  }

  loadCustomComponent() {
    this.hsCustomComponent = undefined;
    const classCode = new Function(
      (this.javascriptCode.value as string) + `return customComponent`,
    );

    const dynamicComponent = Component({
      template: this.htmlCode.value as string,
      styles: [this.cssCode.value as string],
    })(classCode());
    this.hsCustomComponent = new ComponentPortal(dynamicComponent);
  }
}
