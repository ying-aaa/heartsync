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

// 添加单位字段
export function addUnitField(obj: any): any {
  if (Array.isArray(obj)) {
    const unitsFields = obj
      .filter((item) => item.props?.units)
      .map(({ key }) => ({ key: key + 'Units', defaultValue: 'px' }));
    obj.push(...unitsFields);
    return obj.map((item) => addUnitField(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj.fieldGroup)) {
      obj.fieldGroup = addUnitField(obj.fieldGroup);
    }
  }

  return obj;
}

const baseConfig = () =>
  addUnitField([
    {
      type: 'grid',

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

      fieldGroup: [
        {
          type: 'column',

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
          fieldGroup: [
            {
              key: 'height',
              type: 'input',
              props: {
                type: 'number',
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
                units: 'px',
              },
            },
            {
              key: 'backgroundColor',
              type: 'color-picker',

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
            },
            {
              type: 'fieldset',

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
                        icon: 'dehaze',
                        density: 1,
                        styles: {
                          rowGap: 0,
                          rowGapUnits: 'px',
                        },
                      },

                      fieldGroup: [
                        {
                          type: 'grid',

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

                          fieldGroup: [
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'fontSize',
                                  type: 'input',

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
                                    units: 'px',
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
                                  rowGap: 12,
                                  rowGapUnits: 'px',
                                },
                              },

                              fieldGroup: [
                                {
                                  key: 'color',
                                  type: 'color-picker',

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
                                },
                              ],
                            },
                          ],
                        },
                        {
                          key: '6343031977104208',
                          type: 'radio',

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
                              },
                            ],
                            hideFieldUnderline: true,
                            floatLabel: 'always',
                            tabindex: -1,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'fieldset',

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
                        icon: 'dehaze',
                        density: 1,
                        styles: {
                          rowGap: 0,
                          rowGapUnits: 'px',
                        },
                      },

                      fieldGroup: [
                        {
                          type: 'grid',

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

                          fieldGroup: [
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'borderTopWidth',
                                  type: 'input',

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
                                    units: 'px',
                                  },
                                },
                              ],
                            },
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'borderRightWidth',
                                  type: 'input',

                                  props: {
                                    type: 'number',
                                    label: '右',
                                    units: 'px',
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
                                },
                              ],
                            },
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'borderBottomWidth',
                                  type: 'input',

                                  props: {
                                    type: 'number',
                                    label: '下',
                                    units: 'px',
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
                                  rowGap: 12,
                                  rowGapUnits: 'px',
                                },
                              },

                              fieldGroup: [
                                {
                                  key: 'borderLeftWidth',
                                  type: 'input',
                                  props: {
                                    type: 'number',
                                    label: '左',
                                    units: 'px',
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
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'grid',

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

                          fieldGroup: [
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'borderColor',
                                  type: 'color-picker',

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
                                },
                              ],
                            },
                            {
                              type: 'column',

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

                              fieldGroup: [
                                {
                                  key: 'borderStyle',
                                  type: 'select',

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
                        icon: 'dehaze',
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
                            units: 'px',
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
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'fieldset',

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
                        icon: 'dehaze',
                        density: 1,
                        styles: {
                          rowGap: 0,
                          rowGapUnits: 'px',
                        },
                      },

                      fieldGroup: [
                        {
                          key: 'borderRadiusTop',
                          type: 'input',

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
                            units: 'px',
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
                          key: 'borderRadiusRight',
                          type: 'input',

                          props: {
                            type: 'number',
                            label: '右',
                            units: 'px',
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
                          key: 'borderRadiusBottom',
                          type: 'input',

                          props: {
                            type: 'number',
                            label: '下',
                            units: 'px',
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
                          key: 'borderRadiusLeft',
                          type: 'input',

                          props: {
                            type: 'number',
                            label: '左',
                            units: 'px',
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

console.log('%c Line:1115 🥚', 'color:#7f2b82', baseConfig());
const tabConfig = (fieldGroup: IEditorFormlyField[]) => {
  return {
    type: 'tabs',

    fieldGroup,
  };
};

const columnConfig = (label: string, key: string, fieldGroup: IEditorFormlyField[]) => {
  return {
    key,
    type: 'column',

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

    fieldGroup,
  };
};

const menuTabColumnConfig = () =>
  [
    { label: '默认', value: 'default' },
    { label: '移入', value: 'hover' },
    { label: '选中', value: 'active' },
  ].map(({ label, value }) => columnConfig(label, value, baseConfig()));

const menuTabConfig = () =>
  [
    { label: '父菜单', value: 'parent' },
    { label: '子菜单', value: 'children' },
  ].map(({ label, value }) => columnConfig(label, value, [tabConfig(menuTabColumnConfig())]));

console.log('%c menuTabConfig 🥛', 'color:#2eafb0', rewriteFieldId(tabConfig(menuTabConfig())));

export const menu_global_config: IEditorFormlyField[] = [
  rewriteFieldId(tabConfig(menuTabConfig())),
];
