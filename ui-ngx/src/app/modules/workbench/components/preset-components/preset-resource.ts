import { generateUUID } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';

export const presetResource: IEditorFormlyField[] = [
  {
    key: 'layout',
    type: 'group', // 使用 group 类型
    _design: true,
    props: {
      label: '布局',
      typeName: '布局', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '布局器：',
          typeName: '布局器：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'grid',
            type: 'grid',
            _design: true,
            props: {
              label: '栅格',
              icon: 'grid_on',
              typeName: '栅格', // 新增属性
            },
            fieldGroup: [
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 1,
                  label: '列',
                  typeName: '列', // 新增属性
                },
              },
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 2,
                  label: '列',
                  typeName: '列', // 新增属性
                },
              },
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 3,
                  label: '列',
                  typeName: '列', // 新增属性
                },
              },
            ],
          },
          {
            key: 'fieldset',
            type: 'fieldset',
            _design: true,
            props: {
              label: '群组',
              icon: 'subheader',
              typeName: '群组', // 新增属性
            },
            fieldGroup: [
              {
                key: 'grid',
                type: 'grid',
                _design: true,
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  typeName: '栅格', // 新增属性
                },
                fieldGroup: [
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    fieldGroup: [],
                    props: {
                      row: 1,
                      label: '列',
                      typeName: '列', // 新增属性
                    },
                  },
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    fieldGroup: [],
                    props: {
                      row: 2,
                      label: '列',
                      typeName: '列', // 新增属性
                    },
                  },
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    fieldGroup: [],
                    props: {
                      row: 3,
                      label: '列',
                      typeName: '列', // 新增属性
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'flex',
            type: 'flex',
            _design: true,
            props: {
              label: '弹性',
              icon: 'view_column',
              typeName: '弹性', // 新增属性
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  label: '第一个文本',
                  typeName: '第一个文本', // 新增属性
                  style: {
                    type: 'text',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '300px',
                    height: '50px',
                    transform: 'translateX(100px) translateY(50px)',
                  },
                },
              },
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  label: '第二个文本',
                  typeName: '第二个文本', // 新增属性
                  style: {
                    type: 'text',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '150px',
                    height: '50px',
                    transform: 'translateX(300px) translateY(150px)',
                  },
                },
              },
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  label: '第三个文本',
                  typeName: '第三个文本', // 新增属性
                  style: {
                    type: 'text',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '200px',
                    height: '50px',
                    transform: 'translateX(520px) translateY(200px)',
                  },
                },
              },
            ],
          },
          {
            key: 'canvas',
            type: 'canvas',
            _design: true,
            props: {
              label: '画布',
              icon: 'select_all',
              typeName: '画布', // 新增属性
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  type: 'text',
                  label: '第一个文本',
                  typeName: '第一个文本', // 新增属性
                  style: {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '300px',
                    height: '50px',
                    transform: 'translateX(100px) translateY(50px)',
                  },
                },
              },
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  label: '第二个文本',
                  typeName: '第二个文本', // 新增属性
                  style: {
                    type: 'text',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '150px',
                    height: '50px',
                    transform: 'translateX(300px) translateY(150px)',
                  },
                },
              },
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  type: 'text',
                  label: '第三个文本',
                  typeName: '第三个文本', // 新增属性
                  style: {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '200px',
                    height: '50px',
                    transform: 'translateX(520px) translateY(200px)',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        _design: true,
        props: {
          label: '控制器：',
          typeName: '控制器：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'tabs',
            type: 'tabs',
            _design: true,
            props: {
              label: '页签',
              icon: 'tab',
              typeName: '页签', // 新增属性
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本', // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第二个',
                  typeName: '第二个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: '第二个文本', // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第三个',
                  typeName: '第三个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
                      typeName: '第三个文本', // 新增属性
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'accordion',
            type: 'accordion',
            _design: true,
            props: {
              label: '手风琴',
              icon: 'view_day',
              typeName: '手风琴', // 新增属性
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本', // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第二个',
                  typeName: '第二个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: `第二个文本`, // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第三个',
                  typeName: '第三个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
                      typeName: '第三个文本', // 新增属性
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'mat-stepper',
            type: 'mat-stepper',
            _design: true,
            props: {
              label: '步进器',
              icon: 'tab_unselected',
              typeName: '步进器', // 新增属性
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本', // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第二个',
                  typeName: '第二个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: '第二个文本', // 新增属性
                    },
                  },
                ],
              },
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第三个',
                  typeName: '第三个', // 新增属性
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
                      typeName: '第三个文本', // 新增属性
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      // {
      //   _design: true,
      //   props: {
      //     label: '嵌套器：',
      //     typeName: '嵌套器：', // 新增属性
      //   },
      //   fieldGroup: [
      //     {
      //       key: 'title',
      //       type: 'title',
      //       _design: true,
      //       props: {
      //         label: '标题',
      //         typeName: '标题', // 新增属性
      //         icon: 'density_medium',
      //       },
      //     },
      //   ],
      // },
    ],
  },
  {
    key: 'input',
    _design: true,
    _form: true,
    props: {
      label: '输入',
      typeName: '输入', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
          typeName: '输入：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'text',
            type: 'input',
            _design: true,
            props: {
              type: 'text',
              label: '单行文本',
              typeName: '单行文本', // 新增属性
            },
          },
          {
            key: 'textarea',
            type: 'textarea',
            _design: true,
            props: {
              label: '多行文本',
              typeName: '多行文本', // 新增属性
            },
          },
          {
            key: 'number',
            type: 'input',
            _design: true,
            props: {
              type: 'number',
              label: '数字',
              typeName: '数字', // 新增属性
            },
          },
          {
            key: 'password',
            type: 'input',
            _design: true,
            props: {
              type: 'password',
              label: '密码',
              typeName: '密码', // 新增属性
            },
          },
          {
            key: 'color',
            type: 'input',
            _design: true,
            props: {
              type: 'color',
              label: '颜色',
              typeName: '颜色', // 新增属性
            },
          },
          {
            key: 'datepicker',
            type: 'datepicker',
            _design: true,
            props: {
              label: '日期',
              typeName: '日期', // 新增属性
            },
          },
          {
            key: 'richText',
            type: 'rich-text', // 假设你有富文本组件
            _design: true,
            props: {
              label: '富文本',
              typeName: '富文本', // 新增属性
            },
          },
          {
            key: 'draw',
            type: 'draw', // 假设你有手绘组件
            _design: true,
            props: {
              label: '手绘',
              typeName: '手绘', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'select',
    _design: true,
    _form: true,
    props: {
      label: '选择',
      typeName: '选择', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '选择：',
          typeName: '选择：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'radio',
            type: 'radio',
            _design: true,
            props: {
              label: '单选',
              typeName: '单选', // 新增属性
            },
          },
          {
            key: 'checkbox',
            type: 'checkbox',
            _design: true,
            props: {
              label: '多选',
              typeName: '多选', // 新增属性
            },
          },
          {
            key: 'toggle',
            type: 'toggle',
            _design: true,
            props: {
              label: '开关',
              typeName: '开关', // 新增属性
            },
          },
          {
            key: 'select',
            type: 'select',
            _design: true,
            props: {
              label: '下拉单选',
              typeName: '下拉单选', // 新增属性
            },
          },
          {
            key: 'select_multi',
            type: 'select',
            _design: true,
            props: {
              label: '下拉多选',
              typeName: '下拉多选', // 新增属性
              multiple: true,
              selectAllOption: '选择全部',
              options: [
                { value: 1, label: '选项 1' },
                { value: 2, label: '选项 2' },
                { value: 3, label: '选项 3' },
                { value: 4, label: '选项 4', disabled: true },
              ],
            },
          },
          {
            key: 'slider',
            type: 'slider',
            _design: true,
            props: {
              label: '滑块',
              typeName: '滑块', // 新增属性
            },
          },
          {
            key: 'rating',
            type: 'rating',
            _design: true,
            props: {
              label: '评分',
              typeName: '评分', // 新增属性
            },
          },
          {
            key: 'tree-select',
            type: 'tree-select',
            _design: true,
            props: {
              label: '下拉树形',
              typeName: '下拉树形', // 新增属性
            },
          },
          {
            key: 'popup-select',
            type: 'popup-select',
            _design: true,
            props: {
              label: '弹窗选择',
              typeName: '弹窗选择', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'upload',
    _design: true,
    _form: true,
    props: {
      label: '上传',
      typeName: '上传', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '上传：',
          typeName: '上传：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'photo',
            type: 'file-upload',
            _design: true,
            props: {
              label: '照片',
              typeName: '照片', // 新增属性
            },
          },
          {
            key: 'file',
            type: 'file-upload',
            _design: true,
            props: {
              label: '文件',
              typeName: '文件', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'system',
    _form: true,
    _design: true,
    props: {
      label: '系统',
      typeName: '系统', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '系统：',
          typeName: '系统：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'user',
            type: 'system-user',
            _design: true,
            props: {
              label: '用户',
              typeName: '用户', // 新增属性
            },
          },
          {
            key: 'organization',
            type: 'system-organization',
            _design: true,
            props: {
              label: '组织',
              typeName: '组织', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'location',
    _design: true,
    _form: true,
    props: {
      label: '位置',
      typeName: '位置', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '位置',
          typeName: '位置', // 新增属性
        },
        fieldGroup: [
          {
            key: 'address',
            type: 'address-input',
            _design: true,
            props: {
              label: '地址输入',
              typeName: '地址输入', // 新增属性
            },
          },
          {
            key: 'map',
            type: 'map-display',
            _design: true,
            props: {
              label: '地图展示',
              typeName: '地图展示', // 新增属性
            },
          },
          {
            key: 'locationSelect',
            type: 'location-select',
            _design: true,
            props: {
              label: '位置选择',
              typeName: '位置选择', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'subtable',
    _design: true,
    props: {
      label: '子表',
      typeName: '子表', // 新增属性
      wrapperAttr: {
        backgroundColor: '#f1f4fc',
      },
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
          typeName: '输入：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'normalInput',
            type: 'subtable',
            _design: true,
            props: {
              label: '普通输入',
              typeName: '普通输入子表', // 新增属性
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'textarea',
                _design: true,
                props: {
                  row: 1,
                  appearance: 'fill',
                  label: '多行文本',
                  typeName: '多行文本', // 新增属性
                },
              },
            ],
          },
        ],
      },
      {
        _design: true,
        props: {
          label: '弹窗：',
          typeName: '弹窗：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'popupList',
            type: 'popup-list',
            _design: true,
            props: {
              label: '弹窗列表选择',
              typeName: '弹窗列表选择', // 新增属性
            },
          },
          {
            key: 'popupForm',
            type: 'popup-form',
            _design: true,
            props: {
              label: '弹窗表单输入',
              typeName: '弹窗表单输入', // 新增属性
            },
          },
        ],
      },
    ],
  },
  {
    key: 'display',
    _design: true,
    props: {
      label: '展示',
      typeName: '展示', // 新增属性
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '展示：',
          typeName: '展示：', // 新增属性
        },
        fieldGroup: [
          {
            key: 'button',
            type: 'button',
            _design: true,
            props: {
              type: 'basic',
              label: '按钮',
              typeName: '按钮', // 新增属性
            },
          },
          {
            key: 'textDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '文本',
              typeName: '文本', // 新增属性
            },
          },
          {
            key: 'imageDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '图片',
              typeName: '图片', // 新增属性
            },
          },
          {
            key: 'rectangle',
            type: 'display',
            _design: true,
            props: {
              label: '矩形',
              typeName: '矩形', // 新增属性
            },
          },
        ],
      },
    ],
  },
];
