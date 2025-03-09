import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

export const widget_fieldset_config: IEditorFormlyField[] = [
  {
    key: 'props.label',
    type: 'input',
    props: {
      type: 'text',
      label: '标题',
      appearance: 'outline',
    },
    className: 'hs-density--5',
  },
  {
    key: 'fieldGroup[0].fieldGroup',
    type: 'fieldset',
    props: {
      label: '列配置',
      icon: 'subheader',
      styles: {
        fontSize: 14,
        fontSizeUnits: 'px',
      },
    },
    fieldGroup: [
      {
        type: 'array',
        props: {
          label: '宽度',
          appearance: 'outline',
        },
        className: 'hs-density--5',
        fieldArray: {
          fieldGroup: [
            {
              key: 'props.row',
              type: 'input',
              props: {
                type: 'number',
                label: '列宽',
                min: 1,
                max: 24,
              },
            },
          ],
        },
      },
    ],
  },
  {
    type: 'tabs',
    props: {
      label: '页签',
      icon: 'tab',
      placeholder: '',
      disabled: false,
      density: 1,
    },
    className: 'hs-density--1 ',
    fieldGroup: [
      {
        type: 'column',
        props: {
          label: '容器',
          placeholder: '',
          disabled: false,
          density: 1,
          styles: {
            rowGap: 8,
            rowGapUnits: 'px',
          },
        },
        className: 'hs-density--1 ',
        fieldGroup: [
          {
            type: 'fieldset',
            props: {
              label: '边框配置',
              icon: 'subheader',
              placeholder: '',
              disabled: false,
              density: 1,
              showBorder: true,
              styles: {
                color: '',
                fontSize: 14,
                fontSizeUnits: 'px',
                fontWeight: 400,
                paddingLeft: 8,
                paddingLeftUnits: 'px',
                paddingTop: 8,
                paddingTopUnits: 'px',
                paddingRight: 8,
                paddingRightUnits: 'px',
                paddingBottom: 8,
                paddingBottomUnits: 'px',
                borderRadius: 8,
                borderRadiusUnits: 'px',
                borderColor: '#ccc',
                borderWidth: 1,
                borderWidthUnits: 'px',
                borderStyle: 'groove',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  placeholder: '',
                  disabled: false,
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
                    props: {
                      row: 1,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        type: 'grid',
                        props: {
                          label: '栅格',
                          icon: 'grid_on',
                          placeholder: '',
                          disabled: false,
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
                            props: {
                              row: 1,
                              label: '',
                              placeholder: '',
                              disabled: false,
                              density: 1,
                              styles: {
                                rowGap: 8,
                                rowGapUnits: 'px',
                              },
                            },
                            className: 'hs-density--1 ',
                            fieldGroup: [
                              {
                                key: 'props.showBorder',
                                type: 'toggle',
                                props: {
                                  label: '是否显示边框',
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                  hideFieldUnderline: true,
                                  floatLabel: 'always',
                                  hideLabel: true,
                                },
                                expressions: {
                                  'model.props.styles.borderWidth': (model) =>
                                    model.model.props.showBorder
                                      ? model.model.props.styles.borderWidth ||
                                        1
                                      : 0,
                                  'model.props.styles.borderRadius': (model) =>
                                    model.model.props.showBorder
                                      ? model.model.props.styles.borderRadius ||
                                        8
                                      : 0,
                                  'model.props.styles.borderColor': (model) =>
                                    model.model.props.showBorder
                                      ? model.model.props.styles.borderColor ||
                                        '#ccc'
                                      : 'transparent',
                                },

                                className: 'hs-density--5 ',
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
                          placeholder: '',
                          disabled: false,
                          density: 1,
                          styles: {
                            columnGap: 8,
                            columnGapUnits: 'px',
                          },
                        },
                        className: 'hs-density--1 ',
                        hideExpression: (model) => {
                          return !model.props.showBorder;
                        },
                        fieldGroup: [
                          {
                            type: 'column',
                            props: {
                              row: 1,
                              label: '',
                              placeholder: '',
                              disabled: false,
                              density: 1,
                              styles: {
                                rowGap: 8,
                                rowGapUnits: 'px',
                              },
                            },
                            className: 'hs-density--1 ',
                            fieldGroup: [
                              {
                                key: 'props.styles.borderRadius',
                                type: 'input',
                                props: {
                                  type: 'number',
                                  label: '圆角',
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
                                },
                                className: 'hs-density--5 ',
                              },
                            ],
                          },
                          {
                            type: 'column',
                            props: {
                              row: 1,
                              label: '',
                              placeholder: '',
                              disabled: false,
                              density: 1,
                              styles: {
                                rowGap: 8,
                                rowGapUnits: 'px',
                              },
                            },
                            className: 'hs-density--1 ',
                            fieldGroup: [
                              {
                                key: 'props.styles.borderColor',
                                type: 'input',
                                props: {
                                  type: 'color',
                                  label: '颜色',
                                  placeholder: '',
                                  disabled: false,
                                  appearance: 'outline',
                                  density: 5,
                                  description: '',
                                  required: false,
                                  readonly: false,
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
            props: {
              label: '内边距',
              icon: 'subheader',
              placeholder: '',
              disabled: false,
              density: 1,
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  placeholder: '',
                  disabled: false,
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
                    props: {
                      row: 6,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'props.styles.paddingTop',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '上',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                      },
                      {
                        key: 'props.styles.paddingLeft',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '左',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 6,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'props.styles.paddingBottom',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '下',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                      },
                      {
                        key: 'props.styles.paddingRight',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '右',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
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
            props: {
              label: '间距',
              icon: 'subheader',
              placeholder: '',
              disabled: false,
              density: 1,
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  placeholder: '',
                  disabled: false,
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
                    props: {
                      row: 6,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'fieldGroup[0].props.styles.columnGap',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '水平',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 6,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'fieldGroup[0].fieldGroup[0].props.styles.rowGap',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '垂直',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
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
      {
        type: 'column',
        props: {
          label: '标题',
          placeholder: '',
          disabled: false,
          density: 1,
          styles: {
            rowGap: 8,
            rowGapUnits: 'px',
          },
        },
        className: 'hs-density--1 ',
        fieldGroup: [
          {
            key: 'props.styles.fontSize',
            type: 'input',
            props: {
              type: 'number',
              label: '字体大小',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5 ',
          },
          {
            key: 'props.styles.fontWeight',
            type: 'input',
            props: {
              type: 'number',
              label: '文字粗细',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              min: 100,
              max: 900,
              step: 100,
            },
            className: 'hs-density--5 ',
          },
          {
            key: 'props.styles.color',
            type: 'input',
            props: {
              type: 'color',
              label: '字体颜色',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5 ',
          },
        ],
      },
    ],
  },
];
