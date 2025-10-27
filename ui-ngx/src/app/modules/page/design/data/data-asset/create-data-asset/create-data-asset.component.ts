import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataSourceHttpService, IDataSource } from '@src/app/core/http/data-source.http.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ToastrService } from 'ngx-toastr';
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
                    key: 'dashboardId',
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
                        that.dataSourceHttpService
                          .findAll(new PageLink(0, 9999))
                          .subscribe((res) => {
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
              options: [
                {
                  value: 1,
                  label: '选项 1',
                },
                {
                  value: 2,
                  label: '选项 2',
                },
                {
                  value: 3,
                  label: '选项 3',
                },
                {
                  value: 4,
                  label: '选项 4',
                },
              ],
            },
            className: 'hs-density--0 ',
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

  title = this.data.type === 'create' ? '创建资产' : '编辑资产';
  // 完成按钮
  confirmText = this.data.type === 'create' ? '创建' : '保存';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { appId: string; directoryId: string; type: 'create' | 'edit'; id?: string },
    private hsThemeService: HsThemeService,
    public dataSourceHttpService: DataSourceHttpService,
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
    const observable =
      type === 'create'
        ? this.dataSourceHttpService.create(this.sourceForm.value as IDataSource)
        : this.dataSourceHttpService.update(id!, this.sourceForm.value as IDataSource);

    this.loadingStatus.set(true);

    observable.subscribe(
      (appData) => {
        this.loadingStatus.set(false);
        this.toastr.success(`${this.confirmText}}数据源成功!!!`, '', {
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
