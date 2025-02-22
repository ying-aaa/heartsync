import { generateUUID } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
export const presetResource: IEditorFormlyField[] = [
  {
    key: 'layout',
    type: 'group', // 使用 group 类型
    props: {
      label: '布局',
    },
    fieldGroup: [
      {
        props: {
          label: '布局器：',
        },
        fieldGroup: [
          {
            key: 'grid',
            type: 'fieldset',
            props: {
              label: '栅格',
              icon: 'apps',
            },
            fieldGroup: [
              { key: 'column', type: 'column', fieldGroup: [] },
              { key: 'column', type: 'column', fieldGroup: [] },
              { key: 'column', type: 'column', fieldGroup: [] },
            ],
          },
          {
            key: 'flex',
            type: 'flex',
            props: {
              label: '弹性',
              icon: 'view_column',
            },
          },
          {
            key: 'canvas',
            type: 'canvas',
            props: {
              label: '画布',
              icon: 'select_all',
            },
          },
        ],
      },
      {
        props: {
          label: '控制器：',
        },
        fieldGroup: [
          {
            key: 'tabs',
            type: 'tabs',
            props: {
              label: '页签',
              icon: 'tab',
            },
          },
          {
            key: 'accordion',
            type: 'accordion',
            props: {
              label: '手风琴',
              icon: 'view_day',
            },
          },
          {
            key: 'stepper',
            type: 'stepper',
            props: {
              label: '步进器',
              icon: 'tab_unselected',
            },
          },
        ],
      },
      {
        props: {
          label: '嵌套器：',
        },
        fieldGroup: [
          {
            key: 'title',
            type: 'title',
            props: {
              label: '标题',
              icon: 'density_medium',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'input',
    props: {
      label: '输入',
    },
    fieldGroup: [
      {
        props: {
          label: '输入：',
        },
        fieldGroup: [
          {
            key: 'input',
            type: 'input',
            props: {
              label: '单行文本',
            },
          },
          {
            key: 'textarea',
            type: 'textarea',
            props: {
              label: '多行文本',
            },
          },
          {
            key: 'number',
            type: 'number',
            props: {
              label: '数字',
            },
          },
          {
            key: 'password',
            type: 'password',
            props: {
              label: '密码',
            },
          },
          {
            key: 'datepicker',
            type: 'datepicker',
            props: {
              label: '日期',
            },
          },
          {
            key: 'richText',
            type: 'rich-text', // 假设你有富文本组件
            props: {
              label: '富文本',
            },
          },
          {
            key: 'draw',
            type: 'draw', // 假设你有手绘组件
            props: {
              label: '手绘',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'select',
    props: {
      label: '选择',
    },
    fieldGroup: [
      {
        props: {
          label: '选择：',
        },
        fieldGroup: [
          {
            key: 'radio',
            type: 'radio',
            props: {
              label: '单选',
            },
          },
          {
            key: 'checkbox',
            type: 'checkbox',
            props: {
              label: '多选',
            },
          },
          {
            key: 'switch',
            type: 'switch',
            props: {
              label: '开关',
            },
          },
          {
            key: 'dropdown',
            type: 'select',
            props: {
              label: '下拉单选',
            },
          },
          {
            key: 'dropdownMulti',
            type: 'multiselect',
            props: {
              label: '下拉多选',
            },
          },
          {
            key: 'rating',
            type: 'rating',
            props: {
              label: '评分',
            },
          },
          {
            key: 'progress',
            type: 'progress',
            props: {
              label: '进度条',
            },
          },
          {
            key: 'treeSelect',
            type: 'tree-select',
            props: {
              label: '下拉树形',
            },
          },
          {
            key: 'popupSelect',
            type: 'popup-select',
            props: {
              label: '弹窗选择',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'upload',
    props: {
      label: '上传',
    },
    fieldGroup: [
      {
        props: {
          label: '上传：',
        },
        fieldGroup: [
          {
            key: 'photo',
            type: 'file-upload',
            props: {
              label: '照片',
            },
          },
          {
            key: 'file',
            type: 'file-upload',
            props: {
              label: '文件',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'system',
    props: {
      label: '系统',
    },
    fieldGroup: [
      {
        props: {
          label: '系统：',
        },
        fieldGroup: [
          {
            key: 'user',
            type: 'system-user',
            props: {
              label: '用户',
            },
          },
          {
            key: 'organization',
            type: 'system-organization',
            props: {
              label: '组织',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'location',
    props: {
      label: '位置',
    },
    fieldGroup: [
      {
        props: {
          label: '位置',
        },
        fieldGroup: [
          {
            key: 'address',
            type: 'address-input',
            props: {
              label: '地址输入',
            },
          },
          {
            key: 'map',
            type: 'map-display',
            props: {
              label: '地图展示',
            },
          },
          {
            key: 'locationSelect',
            type: 'location-select',
            props: {
              label: '位置选择',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'subtable',
    props: {
      label: '子表',
    },
    fieldGroup: [
      {
        props: {
          label: '输入：',
        },
        fieldGroup: [
          {
            key: 'normalInput',
            type: 'input',
            props: {
              label: '普通输入',
            },
          },
        ],
      },
      {
        props: {
          label: '弹窗：',
        },
        fieldGroup: [
          {
            key: 'popupList',
            type: 'popup-list',
            props: {
              label: '弹窗列表选择',
            },
          },
          {
            key: 'popupForm',
            type: 'popup-form',
            props: {
              label: '弹窗表单输入',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'display',
    props: {
      label: '展示',
    },
    fieldGroup: [
      {
        props: {
          label: '展示：',
        },
        fieldGroup: [
          {
            key: 'textDisplay',
            type: 'display',
            props: {
              label: '文本',
            },
          },
          {
            key: 'imageDisplay',
            type: 'display',
            props: {
              label: '图片',
            },
          },
          {
            key: 'rectangle',
            type: 'display',
            props: {
              label: '矩形',
            },
          },
        ],
      },
    ],
  },
];
