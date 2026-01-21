import { deepClone } from '@src/app/core/utils';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { enhanceFieldData } from './public-api';

const baseConfig = () => [
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
                                  floatLabel: 'always',
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
                                  floatLabel: 'always',
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
                                  floatLabel: 'always',
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
                          floatLabel: 'always',
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
                        key: 'borderTopLeftRadius',
                        type: 'input',

                        props: {
                          type: 'number',
                          label: '左上',
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
                        key: 'borderTopRightRadius',
                        type: 'input',

                        props: {
                          type: 'number',
                          label: '右上',
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
                        key: 'borderBottomRightRadius',
                        type: 'input',

                        props: {
                          type: 'number',
                          label: '右下',
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
                        key: 'borderBottomLeftRadius',
                        type: 'input',

                        props: {
                          type: 'number',
                          label: '左下',
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
];

const tabConfig = (fieldGroup: IEditorFormlyField[]) => {
  const config: IEditorFormlyField = {
    type: 'tabs',
    fieldGroup,
  };
  return config;
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
    { label: '父菜单', value: 'parentMenuItemStyle' },
    { label: '子菜单', value: 'childMenuItemStyle' },
  ].map(({ label, value }) => columnConfig(label, value, [tabConfig(menuTabColumnConfig())]));

const menuContainerStyleConfig = columnConfig('菜单容器', 'menuContainerStyle', [
  {
    key: 'width',
    type: 'input',
    defaultValue: 225,
    props: {
      type: 'number',
      label: '宽度',
      layout: 'top',
      hideLabel: true,
      units: 'px',
    },
  },
  {
    key: 'levelPadding',
    type: 'input',
    defaultValue: 30,
    props: {
      type: 'number',
      label: '菜单每级缩进',
      layout: 'top',
      hideLabel: true,
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
  {
    type: 'fieldset',
    props: {
      label: '外边距',
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
                key: 'marginTop',
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
                key: 'marginRight',
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
                key: 'marginBottom',
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
                key: 'marginLeft',
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
  {
    key: 'backgroundColor',
    type: 'color-picker',
    props: {
      type: 'color-picker',
      label: '背景颜色',
      layout: 'top',
      hideLabel: true,
    },
  },
]);

export const menu_global_config: IEditorFormlyField[] = enhanceFieldData([
  {
    key: 'activeTab',
    type: 'grid-radio',
    defaultValue: 'menuContainer',
    props: {
      label: '自定义样式',
      options: [
        { label: '容器', value: 'menuContainer' },
        { label: '菜单项', value: 'menuItem' },
      ],
    },
  },
  {
    ...menuContainerStyleConfig,
    expressions: {
      hide: (field: IEditorFormlyField) =>
        field.options?.formState.model.showType !== 'menuContainer',
    },
  },
  {
    ...tabConfig(menuTabConfig()),
    expressions: {
      hide: (field: IEditorFormlyField) => field.options?.formState.model.showType !== 'menuItem',
    },
  },
]);

console.log('%c Line:1195 🍆', 'color:#f5ce50', deepClone(menu_global_config));
