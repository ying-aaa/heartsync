import {
  IEditorFormlyField,
  IEditSizeType,
} from '@src/app/shared/models/public-api';

export const widget_config: IEditorFormlyField[] = [
  {
    key: 'workSizeConfig.type',
    type: 'radio',
    props: {
      label: '预览设备尺寸',
      typeName: '单选',
      placeholder: '',
      disabled: false,
      appearance: 'outline',
      density: 5,
      description: '',
      required: false,
      readonly: false,
      options: [
        {
          value: IEditSizeType.FILL,
          label: '撑满',
          width: 100,
          widthUnits: '%',
          height: 100,
          heightUnits: '%',
        },
        {
          value: IEditSizeType.MOBILE,
          label: '手机',
          width: 375,
          widthUnits: 'px',
          height: 667,
          heightUnits: 'px',
        },
        {
          value: IEditSizeType.IPAD,
          label: '平板',
          width: 1024,
          widthUnits: 'px',
          height: 768,
          heightUnits: 'px',
        },
        {
          value: IEditSizeType.PC,
          label: '电脑',
          width: 1980,
          widthUnits: 'px',
          height: 1020,
          heightUnits: 'px',
        },
        {
          value: IEditSizeType.CUSTOM,
          label: '自定义',
          width: 400,
          widthUnits: 'px',
          height: 400,
          heightUnits: 'px',
        },
      ],
      hideFieldUnderline: true,
      floatLabel: 'always',
      tabindex: -1,
    },
    hooks: {
      onInit: (field) => {
        // 监听 fieldA 的变化
        field.formControl?.valueChanges.subscribe((value) => {
          const options = field.props!.options as any[];
          const size = options?.find((item: any) => item.value === value);
          field.model.workSizeConfig.size = size;
          field.options?.build && field.options.build();
        });
      },
    },
    className: 'hs-density--5 ',
  },
  {
    type: 'fieldset',
    props: {
      label: '预览宽高设置',
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
        borderRadius: 4,
        borderRadiusUnits: 'px',
        borderColor: 'var(--mdc-outlined-text-field-outline-color)',
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
                        key: 'workSizeConfig.size.width',
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
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
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
                        key: 'workSizeConfig.size.widthUnits',
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
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
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
                        key: 'workSizeConfig.size.height',
                        type: 'input',
                        props: {
                          type: 'number',
                          label: '高度',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
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
                        key: 'workSizeConfig.size.heightUnits',
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
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
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
  {
    type: 'tabs',
    props: {
      label: '页签',
      icon: 'tab',
      placeholder: '',
      disabled: false,
      density: 1,
    },
    className: 'hs-density--1 mat-tab-item3-full',
    fieldGroup: [
      {
        type: 'column',
        props: {
          label: '外观',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: 'props.density',
            type: 'number',
            props: {
              label: '密度',
              appearance: 'outline',
              min: 0,
              max: 5,
            },
            className: 'hs-density--5',
          },
          {
            key: 'props.appearance',
            type: 'radio',
            props: {
              appearance: 'outline',
              label: '样式类型',
              options: [
                { value: 'fill', label: '填满' },
                { value: 'outline', label: '线条' },
              ],
            },
            className: 'hs-density--5',
          },
        ],
      },
      {
        type: 'column',
        props: {
          label: '数据',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: 'id',
            type: 'input',
            props: {
              type: 'text',
              label: '表单id',
              placeholder: '',
              disabled: true,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5',
          },
        ],
      },
      {
        type: 'column',
        props: {
          label: '交互',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            type: 'input',
            props: {
              label: '第三个文本',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              type: 'password',
            },
            className: 'hs-density--5',
          },
          {
            type: 'checkbox',
            props: {
              label: '多选',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
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
                  disabled: true,
                },
              ],
              hideFieldUnderline: true,
              indeterminate: true,
              floatLabel: 'always',
              hideLabel: true,
              color: 'accent',
            },
            className: 'hs-density--5',
          },
        ],
      },
    ],
  },
];
