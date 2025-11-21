import { IEditorFormlyField } from '@src/app/shared/models/public-api';

export const component_action_config: IEditorFormlyField[] = [
  {
    key: 'componentaAction',
    type: 'array',
    props: {
      label: '变量',
      appearance: 'outline',
      // 新增时默认添加的数据
      defaultAddValue: {
        variables: [],
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
        paddingTop: 12,
        paddingTopUnits: 'px',
        borderRadius: 6,
        borderRadiusUnits: 'px',
        boxShadow: '0px 0px 10px 2px var(--base-color-20)',
        border: '1px solid var(--base-color-05)',
      },
      // hideDrag: true,
    },
    className: 'hs-density--5',
    fieldArray: {
      fieldGroup: [
        {
          type: 'grid',
          fieldId: 'grid_key_2491369384397947',
          props: {
            label: '栅格',
            icon: 'grid_on',
            typeName: '栅格',
            row: 1,
            density: 1,
            styles: {
              rowGap: 8,
              rowGapUnits: 'px',
            },
          },
          className: 'hs-density--1 ',
          fieldGroup: [
            {
              key: 'componentId',
              type: 'select',
              fieldId: 'select_key_4564578817840138',
              props: {
                label: '选择组件',
                typeName: '下拉单选',
                icon: 'playlist_add_check',
                row: 1,
                placeholder: '请选择表单组件',
                disabled: false,
                appearance: 'outline',
                density: 0,
                description: '',
                required: false,
                readonly: false,
              },
              className: 'hs-density--5',
              expressions: {
                'props.options': 'formState.formilyFields',
              },
            },
            {
              key: 'componentType',
              type: 'input',
              fieldId: 'input_key_2579558739748954',
              defaultValue: 'xxx',
              hide: true,
              props: {
                label: '组件ID',
                typeName: '单行文本',
                icon: 'text_fields',
                row: 1,
                placeholder: '请输入组件类型',
                disabled: false,
                appearance: 'outline',
              },
              className: 'hs-density--5',
              expressionProperties: {
                // 监听 'componentId' 的变化，动态计算当前字段的值
                'model.componentType': (model: any, formState: any) => {
                  const selectedComponent = formState.formilyFields?.find(
                    (item: any) => item.key === model?.componentId,
                  );
                  return selectedComponent?.type || '';
                },
              },
            },
            {
              key: 'action',
              type: 'select',
              fieldId: 'select_key_4564578817840138',
              props: {
                label: '执行动作',
                typeName: '下拉单选',
                icon: 'playlist_add_check',
                row: 1,
                placeholder: '请选择需要执行的动作',
                disabled: false,
                appearance: 'outline',
                density: 0,
                description: '',
                required: false,
                readonly: false,
                // options: 'formState.formilyFields',
                usableOptions: [
                  {
                    label: '取值',
                    value: 'getValue',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '设置',
                    value: 'setValue',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '启用',
                    value: 'enable',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '禁用',
                    value: 'disable',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '显示',
                    value: 'show',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '隐藏',
                    value: 'hide',
                    usableType: [
                      'input',
                      'select',
                      'radio',
                      'checkbox',
                      'date',
                      'time',
                      'dateRange',
                    ],
                  },
                  {
                    label: '设置选项',
                    value: 'setOptions',
                    usableType: ['select', 'radio'],
                  },
                ],
              },
              className: 'hs-density--5',
              expressions: {
                'props.options': (field: IEditorFormlyField) => {
                  const componentType = field.model?.componentType;

                  return componentType
                    ? field.props!['usableOptions'].filter((option: any) =>
                        option.usableType.includes(componentType),
                      )
                    : [];
                },
              },
            },
            {
              type: 'fieldset',
              props: {
                label: '设置变量',
                icon: 'subheader',
                styles: {
                  fontSize: 14,
                  fontSizeUnits: 'px',
                  paddingTop: 12,
                  paddingTopUnits: 'px',
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingBottom: 0,
                  borderWidth: 0,
                  marginTop: 4,
                  marginTopUnits: 'px',
                },
              },
              hideExpression: "model.action !== 'getValue'",
              fieldGroup: [
                {
                  key: 'variables',
                  type: 'array',
                  props: {
                    label: '变量',
                    appearance: 'outline',
                    // 新增时默认添加的数据
                    defaultAddValue: {
                      variable: {},
                    },
                  },
                  className: 'hs-density--5',
                  fieldArray: {
                    fieldGroup: [
                      {
                        key: 'variableName',
                        type: 'input',
                        props: {
                          type: 'string',
                          label: '变量名',
                          row: 1,
                        },
                      },
                      {
                        key: 'getValueType',
                        type: 'select',
                        props: {
                          type: 'string',
                          label: '取值类型',
                          row: 1,
                          usableOptions: [
                            {
                              label: '值',
                              value: 'value',
                              usableType: ['input', 'select', 'radio', 'checkbox'],
                            },
                            {
                              label: '开始时间',
                              value: 'startTime',
                              usableType: ['dateRange'],
                            },
                            {
                              label: '结束时间',
                              value: 'endTime',
                              usableType: ['dateRange'],
                            },
                          ],
                        },
                        expressions: {
                          'props.options': (field: IEditorFormlyField) => {
                            console.log('field', field);
                            let targetField = field;
                            let componentType = '';
                            while (targetField?.parent) {
                              targetField = targetField.parent;
                              if (targetField?.model?.componentType) {
                                componentType = targetField.model.componentType;
                                break;
                              }
                            }
                            return componentType
                              ? field.props!['usableOptions'].filter((option: any) =>
                                  option.usableType.includes(componentType),
                                )
                              : [];
                          },
                        },
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
  },
];
