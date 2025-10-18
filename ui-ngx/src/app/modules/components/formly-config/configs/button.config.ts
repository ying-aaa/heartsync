import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

export const button_config: IEditorFormlyField[] = [
  {
    key: 'props.label',
    type: 'input',
    props: {
      type: 'text',
      label: '标题',
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
    key: 'props.type',
    type: 'select',
    props: {
      label: '按钮类型',
      placeholder: '',
      disabled: false,
      appearance: 'outline',
      density: 5,
      description: '',
      required: false,
      readonly: false,
      options: [
        {
          value: 'basic',
          label: '基本',
        },
        {
          value: 'raised',
          label: '凸起',
        },
        {
          value: 'stroked',
          label: '描边',
        },
        {
          value: 'flat',
          label: '扁平',
        },
        {
          value: 'icon',
          label: '图标',
        },
        {
          value: 'fab',
          label: '浮动',
        },
        {
          value: 'mini-fab',
          label: '小型浮动',
        },
        {
          value: 'extended-fab',
          label: '扩展浮动',
        },
      ],
    },
    className: 'hs-density--5 ',
  },
  {
    key: 'props.icon',
    type: 'input',
    props: {
      type: 'text',
      label: '图标',
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
    type: 'fieldset',
    props: {
      label: '样式',
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
    hideExpression: (model) => {
      return model.props.type === 'icon';
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
                    columnGap: 0,
                    columnGapUnits: 'px',
                  },
                },
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    props: {
                      row: 5,
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
                        key: 'props.styles.width',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '宽度',
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
                      row: 4,
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
                        key: 'props.styles.widthUnits',
                        type: 'select',
                        props: {
                          label: '单位',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          options: [
                            {
                              value: 'px',
                              label: 'px',
                            },
                            {
                              value: '%',
                              label: '%',
                            },
                          ],
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
                        key: 'props.styles.fontSize',

                        type: 'input',
                        props: {
                          type: 'number',
                          label: '文字大小',
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
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
