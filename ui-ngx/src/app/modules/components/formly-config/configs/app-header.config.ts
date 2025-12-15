import { IEditorFormlyField } from '@src/app/shared/models/public-api';
import { enhanceFieldData } from './public-api';

export const app_header_config: IEditorFormlyField[] = enhanceFieldData([
  {
    type: 'tabs',
    props: {
      label: '页签',
      icon: 'tab',
      placeholder: '',
      disabled: false,
      density: 1,
    },
    className: 'hs-density--1',
    fieldGroup: [
      {
        type: 'column',
        props: {
          label: '内容',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            template: `<div>内容配置</div>`,
            type: 'template',
          },
          {
            key: 'contentGroups',
            type: 'array',
            props: {
              appearance: 'outline',
              // 新增时默认添加的数据
              defaultAddValue: {
                type: 'placeholder',
              },
              direction: 'horizontal',
              styles: {
                display: 'flex',
                flexDirection: 'column',
                rowGap: 12,
                rowGapUnits: 'px',
              },
              itemStyles: {
                padding: 16,
                paddingUnits: 'px',
                paddingTop: 8,
                paddingTopUnits: 'px',
                borderRadius: 6,
                borderRadiusUnits: 'px',
                border: '1px solid var(--base-color-05)',
                boxShadow: '0px 0px 10px 2px var(--base-color-20)',
              },
              // hideDrag: true,
            },
            className: 'hs-density--5',
            fieldArray: {
              fieldGroup: [
                {
                  type: 'grid',
                  props: {
                    styles: {
                      rowGap: 8,
                      rowGapUnits: 'px',
                      gridTemplateColumns: 'minmax(0, 1fr)',
                    },
                  },
                  fieldGroup: [
                    {
                      key: 'type',
                      type: 'select',
                      defaultValue: 'placeholder',
                      props: {
                        label: '组件类型',
                        placeholder: '请选择组件类型',
                        disabled: false,
                        appearance: 'outline',
                        options: [
                          {
                            label: '应用Logo',
                            value: 'logo',
                          },
                          {
                            label: '用户中心',
                            value: 'userInfo',
                          },
                          {
                            label: '空白占位',
                            value: 'placeholder',
                          },
                          {
                            label: '全屏切换',
                            value: 'fullscreen',
                          },
                          {
                            label: '主题切换',
                            value: 'theme',
                          },
                          {
                            label: '消息',
                            value: 'message',
                          },
                          {
                            label: '自定义',
                            value: 'custom',
                          },
                        ],
                      },
                      className: 'hs-density--5',
                    },
                    {
                      type: 'accordion',
                      props: { label: '配置' },
                      fieldGroup: [
                        {
                          type: 'column',
                          props: { label: '配置' },
                          fieldGroup: [
                            {
                              key: 'styles',
                              type: 'fieldset',
                              props: {
                                label: '宽度',
                                paddingTop: 4,
                                paddingTopUnits: 'px',
                              },
                              fieldGroup: [
                                {
                                  type: 'grid',
                                  props: {
                                    styles: {
                                      columnGap: 8,
                                      columnGapUnits: 'px',
                                      alignItems: 'center',
                                    },
                                  },
                                  fieldGroup: [
                                    {
                                      key: 'widthType',
                                      type: 'grid-radio',
                                      defaultValue: 'flex',
                                      props: {
                                        row: 1,
                                        label: '自定义样式',
                                        options: [
                                          { label: '宽度', value: 'width' },
                                          { label: '列', value: 'flex' },
                                        ],
                                        rows: 2,
                                        layout: 'float',
                                      },
                                      hooks: {
                                        onInit: (field: IEditorFormlyField) => {
                                          const removeFun = (widthType: string) => {
                                            setTimeout(() => {
                                              if (widthType === 'width') {
                                                Reflect.deleteProperty(field.model, 'flex');
                                              } else {
                                                Reflect.deleteProperty(field.model, 'width');
                                                Reflect.deleteProperty(field.model, 'widthUnits');
                                              }
                                            }, 100);
                                          };
                                          removeFun(field.model.widthType);
                                          field.formControl?.valueChanges.subscribe(
                                            (widthType: any) => {
                                              removeFun(widthType);
                                            },
                                          );
                                        },
                                      },
                                    },
                                    {
                                      type: 'column',
                                      props: {
                                        row: 2,
                                      },
                                      fieldGroup: [
                                        {
                                          key: 'widthUnits',
                                          type: 'select',
                                          defaultValue: 'px',
                                          props: {
                                            row: 1,
                                            label: '单位',
                                            options: [
                                              { label: 'px', value: 'px' },
                                              { label: '%', value: '%' },
                                              { label: 'auto', value: 'auto' },
                                              { label: 'fit-content', value: 'fit-content' },
                                            ],
                                            rows: 2,
                                            layout: 'float',
                                          },
                                          hooks: {
                                            onInit: (field: IEditorFormlyField) => {
                                              const handoverFun = (widthUnits: string) => {
                                                if (['auto', 'fit-content'].includes(widthUnits)) {
                                                  field.model.width = '';
                                                } else {
                                                  field.model.width = field.model.width || 100;
                                                }
                                              };
                                              handoverFun(field.model.widthUnits);
                                              field.formControl?.valueChanges.subscribe(
                                                (widthType: any) => {
                                                  handoverFun(widthType);
                                                },
                                              );
                                            },
                                          },
                                          expressionProperties: {
                                            'props.label': (model: any) => {
                                              return ['auto', 'fit-content'].includes(
                                                model.widthUnits,
                                              )
                                                ? '值'
                                                : '单位';
                                            },
                                          },
                                        },
                                        {
                                          key: 'width',
                                          type: 'input',
                                          defaultValue: '100',
                                          props: {
                                            label: '宽度',
                                            type: 'number',
                                            layout: 'float',
                                            row: 1,
                                          },
                                          expressions: {
                                            hide: (field: any) =>
                                              ['auto', 'fit-content'].includes(
                                                field.model.widthUnits,
                                              ),
                                          },
                                        },
                                      ],
                                      resetOnHide: true,
                                      expressions: {
                                        hide: (field: IEditorFormlyField) => {
                                          return field.model.widthType !== 'width';
                                        },
                                      },
                                    },
                                    {
                                      key: 'flex',
                                      type: 'input',
                                      defaultValue: 1,
                                      props: {
                                        row: 2,
                                        label: '列数',
                                        type: 'number',
                                        layout: 'float',
                                      },
                                      resetOnHide: true,
                                      expressions: {
                                        hide: (field: IEditorFormlyField) => {
                                          return field.model.widthType !== 'flex';
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        key: 'headerStyle',
        type: 'column',
        props: {
          label: '样式',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        fieldGroup: [
          {
            key: 'height',
            type: 'input',
            defaultValue: 54,
            props: {
              type: 'number',
              label: '高度',
              layout: 'top',
              hideLabel: true,
              units: 'px',
            },
          },
          {
            key: 'backgroundColor',
            type: 'color-picker',
            props: {
              type: 'color-picker',
              label: '背景颜色',
              layout: 'left',
              hideLabel: true,
              labelWidth: 'auto',
              displayType: 'readonly',
              format: 'rgb',
            },
          },
          {
            type: 'fieldset',
            props: {
              label: '内边距',
              row: 1,
              showBorder: false,
              styles: {
                color: '#000000',
                fontSize: 14,
                fontSizeUnits: 'px',
                fontWeight: 400,
                paddingLeft: 0,
                paddingLeftUnits: 'px',
                paddingTop: 8,
                paddingTopUnits: 'px',
                paddingRight: 0,
                paddingRightUnits: 'px',
                paddingBottom: 0,
                paddingBottomUnits: 'px',
                borderRadius: 0,
                borderRadiusUnits: 'px',
                borderColor: 'var(--mdc-outlined-text-field-outline-color)',
                borderWidth: 0,
                borderWidthUnits: 'px',
              },
            },

            fieldGroup: [
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  typeName: '栅格',
                  density: 1,
                  styles: {
                    columnGap: 8,
                    columnGapUnits: 'px',
                  },
                },
                fieldGroup: [
                  {
                    type: 'column',
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列',
                      density: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    fieldGroup: [
                      {
                        key: 'paddingTop',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '上',
                          icon: '123',
                          row: 1,
                          appearance: 'outline',
                          density: 5,
                          layout: 'float',
                          hideLabel: false,
                          units: 'px',
                          floatLabel: 'always',
                        },
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    fieldGroup: [
                      {
                        key: 'paddingRight',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '右',
                          units: 'px',
                          row: 1,
                          appearance: 'outline',
                          density: 5,
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                          floatLabel: 'always',
                        },
                      },
                    ],
                  },
                  {
                    type: 'column',

                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    fieldGroup: [
                      {
                        key: 'paddingBottom',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '下',
                          units: 'px',
                          row: 1,
                          appearance: 'outline',
                          density: 5,
                          layout: 'float',
                          hideLabel: false,
                          floatLabel: 'always',
                        },
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 1,
                      density: 1,
                      typeName: '列',
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    fieldGroup: [
                      {
                        key: 'paddingLeft',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '左',
                          units: 'px',
                          row: 1,
                          appearance: 'outline',
                          density: 5,
                          layout: 'float',
                          hideLabel: false,
                          floatLabel: 'always',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
