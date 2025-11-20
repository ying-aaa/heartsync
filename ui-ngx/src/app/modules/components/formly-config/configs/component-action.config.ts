import { IEditorFormlyField } from '@src/app/shared/models/public-api';

export const component_action_config: IEditorFormlyField[] = [
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
  // {
  //   key: 'componentType',
  //   type: 'input', // 用input类型，方便存值
  //   props: {
  //     hidden: true, // 隐藏组件，只保留值
  //   },
  // },
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
      allOptions: [
        {
          label: '取值',
          value: 'getValue',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
        {
          label: '设置',
          value: 'setValue',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
        {
          label: '启用',
          value: 'enable',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
        {
          label: '禁用',
          value: 'disable',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
        {
          label: '显示',
          value: 'show',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
        {
          label: '隐藏',
          value: 'hide',
          usableType: ['input', 'select', 'radio', 'checkbox', 'date', 'time'],
        },
      ],
    },
    className: 'hs-density--5',
    expressions: {
      'props.options': '[{label: "请选择需要执行的动作", value: ""}]',
      'props.label': (field: IEditorFormlyField) => {
        return field.model.componentId;
      },
    },
  },
];
