import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssetHttpService } from '@src/app/core/http/asset.http.service';
import { DataSourceHttpService, IDataSource } from '@src/app/core/http/data-source.http.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  combineLatest,
  filter,
  debounceTime,
  tap,
  switchMap,
  catchError,
  of,
  takeUntil,
} from 'rxjs';

/**
 * 通用钩子：根据 dataSourceId + schemaName 拉取表列表
 * @param ds  真实的数据服务（含 getTables 方法）
 * @param debounce 防抖 ms，默认 300
 */
export function resolveTables(
  ds: CreateDataAssetComponent,
  debounce = 300,
): (field: IEditorFormlyField) => void {
  return (field: IEditorFormlyField) => {
    // @ts-ignore
    const destroy$ = (field.hooks!.onDestroy$ ||= new Subject<void>());

    /* 显式指明加载状态 */
    /* 显式指明加载状态 */
    field.props!['loading'] = false;

    const dashboardCtrl = field.form!.get('dataSourceId');
    const schemaCtrl = field.form!.get('schemaName');

    if (!dashboardCtrl || !schemaCtrl) {
      console.warn('[Formly] 找不到 dataSourceId 或 schemaName 控件');
      return;
    }

    /* 监听双字段变化 */
    combineLatest([
      dashboardCtrl.valueChanges.pipe(filter((v) => !!v)),
      schemaCtrl.valueChanges.pipe(filter((v) => !!v)),
    ])
      .pipe(
        debounceTime(debounce),
        tap(() => {
          field.props!['loading'] = true;
          field.formControl!.setValue(null); // 先清空旧选项
        }),
        switchMap(([dataSourceId, schemaName]) =>
          ds.dataSourceHttpService.getTables(dataSourceId as string, schemaName as string).pipe(
            tap(
              (tables) =>
                (field.props!.options = tables.map((t) => ({
                  value: t.table_name,
                  label: t.table_name,
                }))),
            ),
            /* 异常时兜底 */
            catchError(() => {
              field.props!.options = [];
              return of([]);
            }),
            tap(() => (field.props!['loading'] = false)),
          ),
        ),
        takeUntil(destroy$),
      )
      .subscribe();
  };
}

const assetFields = (that: CreateDataAssetComponent) => [
  {
    key: '',
    type: 'grid',
    fieldId: 'grid_key_9353555712980231',
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
    className: 'hs-density--1 ',
    fieldGroup: [
      {
        key: '',
        type: 'column',
        fieldId: 'column_key_7866279417702424',
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
        className: 'hs-density--1 ',
        fieldGroup: [
          {
            key: '',
            type: 'grid',
            fieldId: 'grid_key_7417696175190503',
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
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                key: '',
                type: 'column',
                fieldId: 'column_key_6275459586906366',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    key: 'appId',
                    type: 'input',
                    fieldId: 'input_key_8173869724147847',
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
                    className: 'hs-density--0 ',
                  },
                  {
                    key: 'name',
                    type: 'input',
                    fieldId: 'input_key_4100616951807008',
                    props: {
                      type: 'text',
                      label: '资产名称',
                      typeName: '单行文本',
                      icon: 'format_color_text',
                      row: 1,
                      placeholder: '',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: false,
                      readonly: false,
                    },
                    className: 'hs-density--0 ',
                  },
                ],
              },
              {
                key: '',
                type: 'column',
                fieldId: 'column_key_1680304355160661',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    key: 'directoryId',
                    type: 'input',
                    fieldId: 'input_key_1160440206420491',
                    props: {
                      type: 'text',
                      label: '所属目录',
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
                    className: 'hs-density--0 ',
                  },
                  {
                    key: 'dataSourceId',
                    type: 'select',
                    fieldId: 'select_key_5976806875245755',
                    props: {
                      label: '所属数据源',
                      typeName: '下拉单选',
                      icon: 'playlist_add_check',
                      row: 1,
                      placeholder: '',
                      disabled: false,
                      appearance: 'outline',
                      density: 0,
                      description: '',
                      required: false,
                      readonly: false,
                      options: [],
                    },
                    className: 'hs-density--0 ',
                    hooks: {
                      onInit: (field: IEditorFormlyField) => {
                        const pageLink = new PageLink(0, 9999, [{ prop: 'appId' }]);
                        pageLink.changeSearch('appId', that.sourceModel.appId);
                        that.dataSourceHttpService.findAll(pageLink).subscribe((res) => {
                          field.props!.options = res.data.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }));
                        });
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'comment',
            type: 'textarea',
            fieldId: 'textarea_key_0354086691075900',
            props: {
              label: '资产描述',
              typeName: '多行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '',
              disabled: false,
              rows: 4,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              cols: 1,
            },
            className: 'hs-density--5 ',
          },
        ],
      },
    ],
  },
  {
    key: '',
    type: 'tabs',
    fieldId: 'tabs_key_6724725137156496',
    props: {
      label: '页签',
      icon: 'tab',
      typeName: '页签',
      row: 1,
      density: 1,
    },
    className: 'hs-density--1 ',
    fieldGroup: [
      {
        key: '',
        type: 'column',
        fieldId: 'column_key_4863490947740565',
        props: {
          label: '关联数据表',
          typeName: '第一个',
          icon: 'dehaze',
          density: 1,
          styles: {
            rowGap: 12,
            rowGapUnits: 'px',
          },
        },
        className: 'hs-density--1 ',
        fieldGroup: [
          {
            key: 'schemaName',
            type: 'select',
            fieldId: 'select_key_6864436218623751',
            props: {
              label: '数据库模式',
              typeName: '下拉单选',
              icon: 'playlist_add_check',
              row: 1,
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 0,
              description: '',
              required: false,
              readonly: false,
              options: [],
            },
            className: 'hs-density--0 ',
            expressionProperties: {
              'props.disabled': '!model.dataSourceId',
            },
            hooks: {
              onInit: (field: IEditorFormlyField) => {
                const dataSourceControl = field.form!.get('dataSourceId');
                if (dataSourceControl) {
                  dataSourceControl.valueChanges.subscribe((value) => {
                    if (value) {
                      that.dataSourceHttpService
                        .getSchemas(value)
                        .pipe(
                          catchError(() => {
                            field.props!.options = [];
                            return of([]);
                          }),
                        )
                        .subscribe((res) => {
                          field.props!.options = res.map((item) => ({
                            label: item.schema_name,
                            value: item.schema_name,
                          }));
                        });
                    }
                  });
                }
              },
            },
          },
          {
            key: 'tableName',
            type: 'select',
            fieldId: 'select_key_2824822303130628',
            props: {
              label: '数据库表',
              typeName: '下拉单选',
              icon: 'playlist_add_check',
              row: 1,
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 0,
              description: '',
              required: false,
              readonly: false,
              options: [],
            },
            className: 'hs-density--0 ',
            expressionProperties: {
              'props.disabled': '!model.dataSourceId || !model.schemaName', // 禁用直到 category 被选择
            },
            hooks: {
              onInit: resolveTables(that),
            },
          },
        ],
      },
      {
        key: '',
        type: 'column',
        fieldId: 'column_key_9173508072208631',
        props: {
          label: '自定义字段',
          typeName: '第二个',
          icon: 'dehaze',
          density: 1,
          styles: {
            rowGap: 12,
            rowGapUnits: 'px',
          },
        },
        className: 'hs-density--1 ',
        fieldGroup: [],
      },
    ],
  },
];

@Component({
  selector: 'hs-create-data-asset',
  templateUrl: './create-data-asset.component.html',
  standalone: false,
})
export class CreateDataAssetComponent implements OnInit {
  sourceForm: FormGroup = new FormGroup({});
  sourceModel = {
    appId: this.data.appId,
    directoryId: this.data.directoryId,
  };
  assetFields = assetFields(this);

  loadingStatus = signal<boolean>(false);

  title = this.data.type === 'create' ? '创建数据资产' : '创建数据资产';
  // 完成按钮
  confirmText = this.data.type === 'create' ? '创建' : '保存';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { appId: string; directoryId: string; type: 'create' | 'edit'; id?: string },
    private hsThemeService: HsThemeService,
    public dataSourceHttpService: DataSourceHttpService,
    private assetHttpService: AssetHttpService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateDataAssetComponent>,
  ) {
    this.data.type === 'edit' && this.loadDataSource();
  }

  matRippleColor = () => this.hsThemeService.getCurrentThemeConfig(['#00000010', '#ffffff10']);

  loadDataSource() {
    if (this.data.id) {
      this.dataSourceHttpService.findOne(this.data.id).subscribe((res) => {
        this.sourceForm.patchValue(res);
      });
    }
  }

  submit(): void {
    if (this.data.type === 'edit') {
      this.toastr.warning(' 编辑功能暂未开发！');
      return;
    }
    this.sourceForm.markAllAsTouched();
    if (!this.sourceForm.valid) return;
    const { type, id } = this.data;
    const observable = this.assetHttpService.create(this.sourceForm.value as IDataSource);

    this.loadingStatus.set(true);

    observable.subscribe(
      (appData) => {
        this.loadingStatus.set(false);
        this.toastr.success(`${this.confirmText}}数据资产成功!!!`, '', {
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

  resetForm(): void {
    this.sourceForm.reset();
    this.sourceForm.markAsPristine();
    this.sourceForm.markAsUntouched();
  }

  ngOnInit() {}
}
