import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataSourceHttpService, IDataSource } from '@src/app/core/http/data-source.http.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { ToastrService } from 'ngx-toastr';
const sourceFields = (that: CreateDataSourceComponent) => [
  {
    key: '',
    type: 'grid',
    fieldId: 'grid_key_3884178522940532',
    props: {
      label: '栅格',
      icon: 'grid_on',
      typeName: '栅格',
      row: 1,
      density: 1,
      styles: {
        columnGap: 24,
        columnGapUnits: 'px',
      },
    },
    className: 'hs-density--3',
    fieldGroup: [
      {
        key: '',
        type: 'column',
        fieldId: 'column_key_8650740818575593',
        props: {
          row: 1,
          label: '列',
          typeName: '列',
          icon: 'dehaze',
          density: 1,
          styles: {
            rowGap: 28,
            rowGapUnits: 'px',
          },
        },
        className: 'hs-density--3',
        fieldGroup: [
          {
            key: 'appId',
            type: 'input',
            fieldId: 'input_key_2579558739748954',
            props: {
              type: 'text',
              label: '所属应用ID',
              typeName: '单行文本',
              icon: 'format_color_text',
              row: 1,
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 0,
              description: '',
              required: false,
              readonly: true,
            },
            className: 'hs-density--3',
          },
          {
            key: '',
            type: 'grid',
            fieldId: 'grid_key_5647374327870669',
            props: {
              label: '栅格',
              icon: 'grid_on',
              typeName: '栅格',
              row: 1,
              density: 1,
              styles: {
                columnGap: 24,
                columnGapUnits: 'px',
              },
            },
            className: 'hs-density--3',
            fieldGroup: [
              {
                key: '',
                type: 'column',
                fieldId: 'column_key_3934122474393998',
                props: {
                  row: 1,
                  label: '列',
                  typeName: '列',
                  icon: 'dehaze',
                  density: 1,
                  styles: {
                    rowGap: 28,
                    rowGapUnits: 'px',
                  },
                },
                className: 'hs-density--3',
                fieldGroup: [
                  {
                    key: 'name',
                    type: 'input',
                    fieldId: 'input_key_4363196823490257',
                    props: {
                      type: 'text',
                      label: '数据源名称',
                      typeName: '单行文本',
                      icon: 'format_color_text',
                      row: 1,
                      placeholder: '请输入数据源名称',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'host',
                    type: 'input',
                    fieldId: 'input_key_0293012594679814',
                    props: {
                      type: 'text',
                      label: '主机地址',
                      typeName: '单行文本',
                      icon: 'format_color_text',
                      row: 1,
                      placeholder: '例如：localhost 或 192.168.1.1',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'username',
                    type: 'input',
                    fieldId: 'input_key_0398187333438150',
                    props: {
                      type: 'text',
                      label: '用户名',
                      typeName: '单行文本',
                      icon: 'format_color_text',
                      row: 1,
                      placeholder: '登录用户名',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'database',
                    type: 'input',
                    fieldId: 'input_key_8308507291481975',
                    props: {
                      type: 'text',
                      label: '数据库名称',
                      typeName: '单行文本',
                      icon: 'format_color_text',
                      row: 1,
                      placeholder: '',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'maxPoolCount',
                    type: 'input',
                    fieldId: 'input_key_4025131062342067',
                    props: {
                      type: 'number',
                      label: '连接池最大连接数',
                      typeName: '数字',
                      icon: '123',
                      row: 1,
                      placeholder: '不输入则使用默认',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: false,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                ],
              },
              {
                key: '',
                type: 'column',
                fieldId: 'column_key_3109724325416462',
                props: {
                  row: 1,
                  label: '列',
                  typeName: '列',
                  icon: 'dehaze',
                  density: 1,
                  styles: {
                    rowGap: 28,
                    rowGapUnits: 'px',
                  },
                },
                className: 'hs-density--3',
                fieldGroup: [
                  {
                    key: 'type',
                    type: 'select',
                    fieldId: 'select_key_4564575816260138',
                    props: {
                      label: '数据源类型',
                      typeName: '下拉单选',
                      icon: 'playlist_add_check',
                      row: 1,
                      placeholder: '请选择数据源类型',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                      options: [
                        {
                          value: 'postgres',
                          label: 'PostgreSQL',
                        },
                        {
                          value: 'mysql',
                          label: 'MySQL',
                        },
                        {
                          value: 'MongoDB',
                          label: 'MongoDB',
                        },
                      ],
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'port',
                    type: 'input',
                    fieldId: 'input_key_1962228540476969',
                    props: {
                      type: 'number',
                      label: '端口',
                      typeName: '数字',
                      icon: '123',
                      row: 1,
                      placeholder: '例如：3306',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'password',
                    type: 'input',
                    fieldId: 'input_key_9100159250090693',
                    props: {
                      type: 'password',
                      label: '密码',
                      typeName: '密码',
                      icon: 'password',
                      row: 1,
                      placeholder: '数据库密码',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: true,
                      readonly: false,
                      suffix: that.passwordToggleTpl, // 关联密码显隐模板
                      showPassword: false,
                    },
                    expressions: {
                      'props.type': 'field.props.showPassword ? "text" : "password"',
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'timeout',
                    type: 'input',
                    fieldId: 'input_key_1418836004434089',
                    props: {
                      type: 'number',
                      label: '连接超时时间（秒）',
                      typeName: '数字',
                      icon: '123',
                      row: 1,
                      placeholder: '例如：30',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: false,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                  {
                    key: 'minPoolCount',
                    type: 'input',
                    fieldId: 'input_key_6091916310062948',
                    props: {
                      type: 'number',
                      label: '连接池最大连接数',
                      typeName: '数字',
                      icon: '123',
                      row: 1,
                      placeholder: '不输入则使用默认',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: false,
                      readonly: false,
                    },
                    className: 'hs-density--3',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
@Component({
  selector: 'hs-create-data-source',
  templateUrl: './create-data-source.component.html',
  standalone: false,
})
export class CreateDataSourceComponent implements OnInit, AfterViewInit {
  @ViewChild('passwordToggleTpl') passwordToggleTpl!: TemplateRef<MatIcon>;

  sourceForm: FormGroup = new FormGroup({});
  sourceModel: IDataSource = {
    appId: this.data.appId,
  } as IDataSource;
  sourceFields = signal<FormlyFieldConfig[]>([]);

  loadingStatus = signal<boolean>(false);

  title = this.data.type === 'create' ? '创建数据源' : '编辑数据源';
  // 完成按钮
  confirmText = this.data.type === 'create' ? '创建' : '保存';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appId: string; type: 'create' | 'edit'; id?: string },
    private hsThemeService: HsThemeService,
    private dataSourceHttpService: DataSourceHttpService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateDataSourceComponent>,
  ) {
    this.data.type === 'edit' && this.loadDataSource();
  }

  ngAfterViewInit(): void {
    this.sourceFields.set(sourceFields(this));
  }

  matRippleColor = () => this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  loadDataSource() {
    if (this.data.id) {
      this.loadingStatus.set(true);
      this.dataSourceHttpService.findOne(this.data.id).subscribe((res) => {
        this.sourceModel = { ...res, password: '******' };
        this.loadingStatus.set(false);
      });
    }
  }

  submit(): void {
    this.sourceForm.markAllAsTouched();
    if (!this.sourceForm.valid) return;
    const { type, id } = this.data;
    const sourceData = this.sourceModel;
    if (sourceData.password === '******') {
      Reflect.deleteProperty(sourceData, 'password');
    }
    const observable =
      type === 'create'
        ? this.dataSourceHttpService.create(sourceData)
        : this.dataSourceHttpService.update(id!, sourceData);

    this.loadingStatus.set(true);

    observable.subscribe(
      (appData) => {
        this.loadingStatus.set(false);
        this.toastr.success(`${this.confirmText}数据源成功!!!`, '', {
          positionClass: 'toast-top-center',
        });
        this.dialogRef.close(appData);
      },
      (error) => {
        this.loadingStatus.set(false);
        this.toastr.error(error.message, '', {
          positionClass: 'toast-top-center',
        });
      },
    );
  }

  testConnection(): void {
    // 开启表单验证
    this.sourceForm.markAllAsTouched();
    if (!this.sourceForm.valid) return;
    const sourceData = this.sourceModel;
    if (sourceData.password === '******') {
      Reflect.deleteProperty(sourceData, 'password');
    }
    this.loadingStatus.set(true);
    this.dataSourceHttpService.testConnection(sourceData as IDataSource).subscribe({
      next: (res) => {
        this.loadingStatus.set(false);

        if (res.success) {
          this.toastr.success('测试连接成功!!!', '', {
            positionClass: 'toast-top-center',
          });
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.loadingStatus.set(false);
        this.toastr.error('测试连接失败 ' + err.message);
      },
    });
  }

  resetForm(): void {
    this.sourceForm.reset();
    this.sourceForm.markAsPristine();
    this.sourceForm.markAsUntouched();
  }

  ngOnInit() {}
}
