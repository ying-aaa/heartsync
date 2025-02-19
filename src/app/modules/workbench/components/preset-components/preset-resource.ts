import { generateUUID } from '@src/app/core/utils';
import { IFieldType } from '@src/app/shared/models/editor.model';

export const presetResource = [
  {
    key: 'layout',
    fieldId: generateUUID(`preset_key_`),
    wrappers: ['group'], // 使用 col 包装器
    name: '布局',
    value: 'layout',
    group: [
      {
        name: '布局器：',
        key: 'layout',
        fieldId: generateUUID(`preset_key_`),
        wrappers: ['col'], // 使用 col 包装器
        groupChild: [
          {
            name: '栅格',
            comp: 'group',
            icon: 'apps',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'], // 使用 col 包装器},
          },
          {
            name: '弹性',
            comp: 'group',
            icon: 'view_column',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'], // 使用 col 包装器},
          },
          {
            name: '画布',
            comp: 'group',
            icon: 'select_all',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'], // 使用 col 包装器},
          },
        ],
      },
      {
        name: '控制器：',
        groupChild: [
          {
            name: '页签',
            icon: 'tab',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'],
          },
          {
            name: '手风琴',
            icon: 'view_day',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'],
          },
          {
            name: '步进器',
            icon: 'tab_unselected',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'],
          },
        ],
      },
      {
        name: '嵌套器：',
        groupChild: [
          {
            name: '标题',
            icon: 'density_medium',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            wrappers: ['group'],
          },
        ],
      },
    ],
  },
  {
    name: '输入',
    value: 'input',
    group: [
      {
        name: '输入：',
        groupChild: [
          {
            name: '单行文本',
            comp: 'input',
            icon: '',
            componentName: '',
            key: 'input',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: 'input',
          },
          {
            name: '多行文本',
            comp: 'textarea',
            icon: '',
            componentName: '',
            key: 'textarea',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: 'textarea',
          },
          {
            name: '数字',
            comp: 'number',
            icon: '',
            componentName: '',
            key: 'number',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: 'number',
          },
          {
            name: '密码',
            comp: 'password',
            icon: '',
            componentName: '',
            key: 'password',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: 'password',
          },
          {
            name: '日期',
            comp: 'datepicker',
            icon: '',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: 'datepicker',
          },
          {
            name: '富文本',
            icon: '',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: '',
          },
          {
            name: '手绘',
            icon: '',
            componentName: '',
            key: 'layout',
            fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
            type: '',
          },
        ],
      },
    ],
  },
  {
    name: '选择',
    value: 'select',
    group: [
      {
        name: '选择：',
        groupChild: [
          { name: '单选', icon: '', componentName: '' },
          { name: '多选', icon: '', componentName: '' },
          { name: '开关', icon: '', componentName: '' },
          { name: '下拉单选', icon: '', componentName: '' },
          { name: '下拉多选', icon: '', componentName: '' },
          { name: '评分', icon: '', componentName: '' },
          { name: '进度条', icon: '', componentName: '' },
          { name: '下拉树形', icon: '', componentName: '' },
          { name: '弹窗选择', icon: '', componentName: '' },
        ],
      },
    ],
  },
  {
    name: '上传',
    value: 'upload',
    group: [
      {
        name: '上传：',
        groupChild: [
          { name: '照片', icon: '', componentName: '' },
          { name: '文件', icon: '', componentName: '' },
        ],
      },
    ],
  },
  {
    name: '系统',
    value: 'system',
    group: [
      {
        name: '系统：',
        groupChild: [
          { name: '用户', icon: '', componentName: '' },
          { name: '组织', icon: '', componentName: '' },
        ],
      },
    ],
  },

  {
    name: '位置',
    value: 'location',
    group: [
      {
        name: '位置',
        groupChild: [
          { name: '地址输入', icon: '', componentName: '' },
          { name: '地图展示', icon: '', componentName: '' },
          { name: '位置选择', icon: '', componentName: '' },
        ],
      },
    ],
  },
  {
    name: '子表',
    value: 'subtable',
    group: [
      {
        name: '输入：',
        groupChild: [{ name: '普通输入', icon: '', componentName: '' }],
      },
      {
        name: '弹窗：',
        groupChild: [
          { name: '弹窗列表选择', icon: '', componentName: '' },
          { name: '弹窗表单输入', icon: '', componentName: '' },
        ],
      },
    ],
  },
  {
    name: '展示',
    value: 'display',
    group: [
      {
        name: '展示：',
        groupChild: [
          { name: '文本', icon: '', componentName: '' },
          { name: '图片', icon: '', componentName: '' },
          { name: '矩形', icon: '', componentName: '' },
        ],
      },
    ],
  },
];
