import { deepClone, generateUUID } from '@src/app/core/utils';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
// 递归函数，查询对象及子数据fieldGroup下的对象有key属性的，给key值前面添加执行值，
export function addKeyPrefix(obj: any, prefix: string): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => addKeyPrefix(item, prefix));
  }

  if (typeof obj === 'object' && obj !== null) {
    if (typeof obj.key === 'string') {
      obj.key = prefix + obj.key;
    }

    // 递归处理 fieldGroup，不管有没有 key
    if (Array.isArray(obj.fieldGroup)) {
      obj.fieldGroup = addKeyPrefix(obj.fieldGroup, prefix);
    }
  }

  return obj;
}

// 重写fieldId
export function rewriteFieldId(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => rewriteFieldId(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    obj.fieldId = generateUUID(`${obj.type}_key_`);

    if (Array.isArray(obj.fieldGroup)) {
      obj.fieldGroup = rewriteFieldId(obj.fieldGroup);
    }
  }

  return obj;
}

const baseConfig = () => [
  {
    type: 'grid',
    fieldId: 'grid_key_4125839379546446',
    props: {
      label: '栅格',
      icon: 'grid_on',
      typeName: '栅格',
      row: 1,
      density: 1,
      styles: {
        columnGap: 8,
        columnGapUnits: 'px',
      },
    },
    className: 'hs-density--1 ',
    fieldGroup: [
      {
        type: 'column',
        fieldId: 'column_key_3145554651358639',
        props: {
          row: 1,
          label: '列',
          typeName: '列',
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
            key: 'height',
            type: 'input',
            fieldId: 'input_key_5842853288220215',
            props: {
              type: 'text',
              label: '高度',
              typeName: '单行文本',
              icon: 'format_color_text',
              row: 1,
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              layout: 'top',
              hideLabel: true,
              logicConfig: [],
            },
            className: 'hs-density--5 ',
          },
          {
            key: 'backgroundColor',
            type: 'color-picker',
            fieldId: 'color-picker_key_2553894405121193',
            props: {
              type: 'color-picker',
              label: '背景颜色',
              typeName: '颜色选择器',
              icon: 'color_lens',
              row: 1,
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              layout: 'top',
              hideLabel: true,
            },
            className: 'hs-density--5 ',
          },
          {
            type: 'fieldset',
            fieldId: 'fieldset_key_5204537797395688',
            props: {
              label: '文本',
              icon: 'subtitles',
              typeName: '群组',
              row: 1,
              density: 1,
              showBorder: false,
              styles: {
                color: '',
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
                borderStyle: 'groove',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                fieldId: 'grid_key_3701295339030717',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    fieldId: 'column_key_1714813672530558',
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列',
                      icon: 'dehaze',
                      density: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        type: 'grid',
                        fieldId: 'grid_key_7058222082891699',
                        props: {
                          label: '栅格',
                          icon: 'grid_on',
                          typeName: '栅格',
                          row: 1,
                          density: 1,
                          styles: {
                            columnGap: 8,
                            columnGapUnits: 'px',
                          },
                        },
                        className: 'hs-density--1 ',
                        fieldGroup: [
                          {
                            type: 'column',
                            fieldId: 'column_key_6343906307993955',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: 'fontSize',
                                type: 'input',
                                fieldId: 'input_key_8794836742762947',
                                props: {
                                  type: 'number',
                                  label: '字号',
                                  typeName: '数字',
                                  icon: '123',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            fieldId: 'column_key_0073256696024210',
                            props: {
                              row: 1,
                              density: 1,
                              typeName: '列',
                              styles: {
                                rowGap: 12,
                                rowGapUnits: 'px',
                              },
                            },
                            className: 'hs-density--1 ',
                            fieldGroup: [
                              {
                                key: 'color',
                                type: 'color-picker',
                                fieldId: 'input_key_3961295624622589',
                                props: {
                                  type: 'text',
                                  label: '颜色',
                                  typeName: '颜色选择器',
                                  icon: 'format_color_text',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        key: '6343031977104208',
                        type: 'radio',
                        fieldId: 'radio_key_6343031977104208',
                        props: {
                          label: '修饰',
                          typeName: '单选',
                          icon: 'radio_button_checked',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                          options: [
                            {
                              value: '1',
                              label: '无',

                              fieldId: 'undefined_key_8629653722312486',
                            },
                            {
                              value: 'bold',
                              label: '加粗',
                            },
                            {
                              value: 'italic',
                              label: '斜体',
                            },
                            {
                              value: 'underline',
                              label: '下划线',

                              fieldId: 'undefined_key_5331574377310774',
                            },
                          ],
                          hideFieldUnderline: true,
                          floatLabel: 'always',
                          tabindex: -1,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'fieldset',
            fieldId: 'fieldset_key_3833156542888147',
            props: {
              label: '边框',
              icon: 'subtitles',
              typeName: '群组',
              row: 1,
              density: 1,
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
                borderStyle: 'groove',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                fieldId: 'grid_key_6508518865174247',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    fieldId: 'column_key_2037555735292794',
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列',
                      icon: 'dehaze',
                      density: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        type: 'grid',
                        fieldId: 'grid_key_8598793279698213',
                        props: {
                          label: '栅格',
                          icon: 'grid_on',
                          typeName: '栅格',
                          row: 1,
                          density: 1,
                          styles: {
                            columnGap: 8,
                            columnGapUnits: 'px',
                          },
                        },
                        className: 'hs-density--1 ',
                        fieldGroup: [
                          {
                            type: 'column',
                            fieldId: 'column_key_4734193611220844',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: 'borderTopWidth',
                                type: 'input',
                                fieldId: 'input_key_5407468942026959',
                                props: {
                                  type: 'number',
                                  label: '上',
                                  typeName: '数字',
                                  icon: '123',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            fieldId: 'column_key_3080677095824304',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: 'borderRightWidth',
                                type: 'input',
                                fieldId: 'input_key_9777453826058875',
                                props: {
                                  type: 'number',
                                  label: '右',
                                  typeName: '数字',
                                  icon: '123',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            fieldId: 'column_key_8236188646449520',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: 'borderBottomWidth',
                                type: 'input',
                                fieldId: 'input_key_8208237334791058',
                                props: {
                                  type: 'number',
                                  label: '下',
                                  typeName: '数字',
                                  icon: '123',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            fieldId: 'column_key_4623191549390156',
                            props: {
                              row: 1,
                              density: 1,
                              typeName: '列',
                              styles: {
                                rowGap: 12,
                                rowGapUnits: 'px',
                              },
                            },
                            className: 'hs-density--1 ',
                            fieldGroup: [
                              {
                                key: 'borderLeftWidth',
                                type: 'input',
                                fieldId: 'input_key_6496553751679847',
                                props: {
                                  type: 'number',
                                  label: '左',
                                  typeName: '数字',
                                  icon: '123',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'grid',
                        fieldId: 'grid_key_9510636033428428',
                        props: {
                          label: '栅格',
                          icon: 'grid_on',
                          typeName: '栅格',
                          row: 1,
                          density: 1,
                          styles: {
                            columnGap: 8,
                            columnGapUnits: 'px',
                          },
                        },
                        className: 'hs-density--1 ',
                        fieldGroup: [
                          {
                            type: 'column',
                            fieldId: 'column_key_0685834759630585',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: '0406614401135860',
                                type: 'color-picker',
                                fieldId: 'color-picker_key_0406614401135860',
                                props: {
                                  type: 'color-picker',
                                  label: '边框颜色',
                                  typeName: '颜色选择器',
                                  icon: 'color_lens',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            fieldId: 'column_key_7825176596596859',
                            props: {
                              row: 1,
                              label: '列',
                              typeName: '列',
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
                                key: '0917766270767932',
                                type: 'select',
                                fieldId: 'select_key_0917766270767932',
                                props: {
                                  label: '边框样式',
                                  typeName: '下拉单选',
                                  icon: 'playlist_add_check',
                                  row: 1,
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  layout: 'float',
                                  hideLabel: false,
                                  options: [
                                    {
                                      value: 'solid',
                                      label: '―――――――',
                                    },
                                    {
                                      value: 'dashed',
                                      label: '------------',
                                    },
                                  ],
                                },
                                className: 'hs-density--5 ',
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
          {
            type: 'fieldset',
            fieldId: 'fieldset_key_0574252239323860',
            props: {
              label: '内边距',
              icon: 'subtitles',
              typeName: '群组',
              row: 1,
              density: 1,
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
                borderStyle: 'groove',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                fieldId: 'grid_key_8148230383056563',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    fieldId: 'column_key_8522861696417459',
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列',
                      icon: 'dehaze',
                      density: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'paddingTop',
                        type: 'input',
                        fieldId: 'input_key_4549006674991928',
                        props: {
                          type: 'number',
                          label: '上',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_2280145537873719',
                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'paddingRight',
                        type: 'input',
                        fieldId: 'input_key_9686934461589891',
                        props: {
                          type: 'number',
                          label: '右',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_9021716567776800',
                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'paddingBottom',
                        type: 'input',
                        fieldId: 'input_key_7900306609940210',
                        props: {
                          type: 'number',
                          label: '下',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_8784058492709462',
                    props: {
                      row: 1,
                      density: 1,
                      typeName: '列',
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'paddingLeft',
                        type: 'input',
                        fieldId: 'input_key_5712593942493580',
                        props: {
                          type: 'number',
                          label: '左',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'fieldset',
            fieldId: 'fieldset_key_4965460729938376',
            props: {
              label: '圆角',
              icon: 'subtitles',
              typeName: '群组',
              row: 1,
              density: 1,
              showBorder: false,
              styles: {
                color: '',
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
                borderStyle: 'groove',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                fieldId: 'grid_key_6990305553853432',
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
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    fieldId: 'column_key_2437860263076658',
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列',
                      icon: 'dehaze',
                      density: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'borderRadiusTop',
                        type: 'input',
                        fieldId: 'input_key_7620617763190043',
                        props: {
                          type: 'number',
                          label: '上',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_2437240780436832',
                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'borderRadiusRight',
                        type: 'input',
                        fieldId: 'input_key_7437209433558387',
                        props: {
                          type: 'number',
                          label: '右',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_7858060374179196',
                    props: {
                      row: 1,
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                      density: 1,
                      typeName: '列',
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'borderRadiusBottom',
                        type: 'input',
                        fieldId: 'input_key_5541440355468507',
                        props: {
                          type: 'number',
                          label: '下',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    fieldId: 'column_key_4616699025576587',
                    props: {
                      row: 1,
                      density: 1,
                      typeName: '列',
                      styles: {
                        rowGap: 0,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'borderRadiusLeft',
                        type: 'input',
                        fieldId: 'input_key_6407354598179881',
                        props: {
                          type: 'number',
                          label: '左',
                          typeName: '数字',
                          icon: '123',
                          row: 1,
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          layout: 'float',
                          hideLabel: false,
                        },
                        className: 'hs-density--5 ',
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
];

const tabConfig = (fieldGroup: IEditorFormlyField[]) => {
  return {
    type: 'tabs',
    fieldId: 'tabs_key_1892052929924826',
    fieldGroup,
  };
};

const columnConfig = (label: string, key: string, fieldGroup: IEditorFormlyField[]) => {
  return {
    key,
    type: 'column',
    fieldId: 'column_key_1483744772775598',
    props: {
      label,
      typeName: label,
      icon: 'dehaze',
      density: 1,
      styles: {
        rowGap: 12,
        rowGapUnits: 'px',
      },
    },
    className: 'hs-density--1 ',
    fieldGroup,
  };
};

const menuTabColumnConfig = [
  { label: '默认', value: 'default' },
  { label: '移入', value: 'hover' },
  { label: '选中', value: 'active' },
].map(({ label, value }) => columnConfig(label, value, baseConfig()));

const menuTabConfig = [
  { label: '父菜单', value: 'parent' },
  { label: '子菜单', value: 'children' },
].map(({ label, value }) =>
  columnConfig(label, value, [tabConfig(addKeyPrefix(menuTabColumnConfig, `${value}_`))]),
);

console.log('%c menuTabConfig 🥛', 'color:#2eafb0', rewriteFieldId(tabConfig(menuTabConfig)));

export const menu_global_config: IEditorFormlyField[] = [rewriteFieldId(tabConfig(menuTabConfig))];
