import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AceEditorComponent } from '@src/app/shared/components/ace-editor/ace-editor.component';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CodeToolbarComponent } from './code-toolbar/code-toolbar.component';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { WidgetCodeComponent } from '@src/app/modules/components/widget-code/widget-code.component';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { ICodeWidgetConfig } from '@src/app/shared/models/code-widget.model';
import { CodeWidgetService } from '@src/app/core/http/code-widget.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private codeWidgetService: CodeWidgetService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) {}

  model = {};

  widgetInfo = signal<ICodeWidgetConfig>({
    id: '1',
    templateHtml: ``,
    templateCss: ``,
    templateJs: ``,
    resourceScript: [],
  });

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

  ngAfterViewInit() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    this.codeWidgetService
      .getCodeWidgetById(widgetId)
      .subscribe((widgetInfo) => {
        this.widgetInfo.set(widgetInfo);
      });
  }

  loadCustomComponent() {
    this.WidgetCode.loadResourceScript();
  }

  saveWidgetInfo() {
    this.codeWidgetService.updateCodeWidget(this.widgetInfo()).subscribe({
      next: () => {
        this._snackBar.open('更新部件成功!!!', '确定', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
      },
      error: (err: any) => console.error('Update widget error:', err),
    });
  }
}
