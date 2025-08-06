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
      typeName: '布局',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '布局器：',
          typeName: '布局器：',
        },
        fieldGroup: [
          {
            key: 'grid',
            type: 'grid',
            _design: true,
            props: {
              label: '栅格',
              icon: 'grid_on',
              typeName: '栅格',
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
                  typeName: '列',
                  icon: 'dehaze',
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
                  typeName: '列',
                  icon: 'dehaze',
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
                  typeName: '列',
                  icon: 'dehaze',
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
              icon: 'subtitles',
              typeName: '群组',
            },
            fieldGroup: [
              {
                key: 'grid',
                type: 'grid',
                _design: true,
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  typeName: '栅格',
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
                      typeName: '列',
                      icon: 'dehaze',
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
                      typeName: '列',
                      icon: 'dehaze',
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
                      typeName: '列',
                      icon: 'dehaze',
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
              typeName: '弹性',
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                _bindKey: true,
                props: {
                  label: '第一个文本',
                  typeName: '第一个文本',
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
                _bindKey: true,
                props: {
                  label: '第二个文本',
                  typeName: '第二个文本',
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
                _bindKey: true,
                props: {
                  label: '第三个文本',
                  typeName: '第三个文本',
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
              typeName: '画布',
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                _bindKey: true,
                props: {
                  type: 'text',
                  label: '第一个文本',
                  typeName: '第一个文本',
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
                _bindKey: true,
                props: {
                  label: '第二个文本',
                  typeName: '第二个文本',
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
                _bindKey: true,
                props: {
                  type: 'text',
                  label: '第三个文本',
                  typeName: '第三个文本',
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
          typeName: '控制器：',
        },
        fieldGroup: [
          {
            key: 'tabs',
            type: 'tabs',
            _design: true,
            props: {
              label: '页签',
              icon: 'tab',
              typeName: '页签',
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本',
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
                  typeName: '第二个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: '第二个文本',
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
                  typeName: '第三个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
                      typeName: '第三个文本',
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
              typeName: '手风琴',
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本',
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
                  typeName: '第二个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: `第二个文本`,
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
                  typeName: '第三个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
                      typeName: '第三个文本',
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
              typeName: '步进器',
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                  typeName: '第一个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
                      typeName: '第一个文本',
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
                  typeName: '第二个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    _bindKey: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
                      typeName: '第二个文本',
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
                  typeName: '第三个',
                  icon: 'dehaze',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      _bindKey: true,
                      label: '第三个文本',
                      typeName: '第三个文本',
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
      //     typeName: '嵌套器：',
      //   },
      //   fieldGroup: [
      //     {
      //       key: 'title',
      //       type: 'title',
      //       _design: true,
      //       props: {
      //         label: '标题',
      //         typeName: '标题',
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
      typeName: '输入',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
          typeName: '输入：',
        },
        fieldGroup: [
          {
            key: 'text',
            type: 'input',
            _design: true,
            _bindKey: true,
            props: {
              type: 'text',
              label: '单行文本',
              typeName: '单行文本',
              icon: 'format_color_text',
            },
          },
          {
            key: 'textarea',
            type: 'textarea',
            _design: true,
            _bindKey: true,
            props: {
              label: '多行文本',
              typeName: '多行文本',
              icon: 'text_fields',
            },
          },
          {
            key: 'number',
            type: 'input',
            _design: true,
            _bindKey: true,
            props: {
              type: 'number',
              label: '数字',
              typeName: '数字',
              icon: '123',
            },
          },
          {
            key: 'password',
            type: 'input',
            _design: true,
            _bindKey: true,
            props: {
              type: 'password',
              label: '密码',
              typeName: '密码',
              icon: 'password',
            },
          },
          {
            key: 'color-picker',
            type: 'color-picker',
            _design: true,
            _bindKey: true,
            props: {
              type: 'color-picker',
              label: '颜色选择',
              typeName: '颜色选择器',
              icon: 'color_lens',
            },
          },
          {
            key: 'datepicker',
            type: 'datepicker',
            _design: true,
            _bindKey: true,
            props: {
              label: '日期',
              typeName: '日期',
              icon: 'date_range',
            },
          },
          {
            key: 'richText',
            type: 'rich-text', // 假设你有富文本组件
            _design: true,
            _bindKey: true,
            props: {
              label: '富文本',
              typeName: '富文本',
              icon: 'text_snippet',
            },
          },
          {
            key: 'draw',
            type: 'draw', // 假设你有手绘组件
            _design: true,
            _bindKey: true,
            props: {
              label: '手绘',
              typeName: '手绘',
              icon: 'draw',
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
      typeName: '选择',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '选择：',
          typeName: '选择：',
        },
        fieldGroup: [
          {
            key: 'radio',
            type: 'radio',
            _design: true,
            _bindKey: true,
            props: {
              label: '单选',
              typeName: '单选',
              icon: 'radio_button_checked',
            },
          },
          {
            key: 'checkbox',
            type: 'checkbox',
            _design: true,
            _bindKey: true,
            props: {
              label: '多选',
              typeName: '多选',
              icon: 'check_box',
            },
          },
          {
            key: 'toggle',
            type: 'toggle',
            _design: true,
            _bindKey: true,
            props: {
              label: '开关',
              typeName: '开关',
              icon: 'toggle_on',
            },
          },
          {
            key: 'select',
            type: 'select',
            _design: true,
            _bindKey: true,
            props: {
              label: '下拉单选',
              typeName: '下拉单选',
              icon: 'playlist_add_check',
            },
          },
          {
            key: 'select_multi',
            type: 'select',
            _design: true,
            _bindKey: true,
            props: {
              label: '下拉多选',
              typeName: '下拉多选',
              icon: 'checklist_rtl',
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
            _bindKey: true,
            props: {
              label: '滑块',
              typeName: '滑块',
              icon: 'linear_scale',
            },
          },
          {
            key: 'rating',
            type: 'rating',
            _design: true,
            _bindKey: true,
            props: {
              label: '评分',
              typeName: '评分',
              icon: 'star_half',
            },
          },
          {
            key: 'tree-select',
            type: 'tree-select',
            _design: true,
            _bindKey: true,
            props: {
              label: '下拉树形',
              typeName: '下拉树形',
              icon: 'format_list_bulleted',
            },
          },
          {
            key: 'popup-select',
            type: 'popup-select',
            _design: true,
            _bindKey: true,
            props: {
              label: '弹窗选择',
              typeName: '弹窗选择',
              icon: 'view_compact_alt',
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
      typeName: '上传',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '上传：',
          typeName: '上传：',
        },
        fieldGroup: [
          {
            key: 'photo',
            type: 'file-upload',
            _design: true,
            _bindKey: true,
            props: {
              label: '照片',
              typeName: '照片',
              icon: 'photo',
            },
          },
          {
            key: 'file',
            type: 'file-upload',
            _design: true,
            _bindKey: true,
            props: {
              label: '文件',
              typeName: '文件',
              icon: 'file_present',
            },
          },
        ],
      },
    ],
  },
  {
    key: 'system',
    _bindKey: true,
    _form: true,
    props: {
      label: '系统',
      typeName: '系统',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '系统：',
          typeName: '系统：',
        },
        fieldGroup: [
          {
            key: 'user',
            type: 'system-user',
            _design: true,
            _bindKey: true,
            props: {
              label: '用户',
              typeName: '用户',
              icon: 'person',
            },
          },
          {
            key: 'organization',
            type: 'system-organization',
            _design: true,
            _bindKey: true,
            props: {
              label: '组织',
              typeName: '组织',
              icon: 'group',
            },
          },
        ],
      },
      {
        _design: true,
        props: {
          label: '自动',
          typeName: '自动：',
        },
        fieldGroup: [
          {
            key: 'numbers',
            type: 'numbers',
            _design: true,
            _bindKey: true,
            props: {
              label: '编号生成',
              typeName: '编号生成：',
              icon: 'numbers',
            },
          },
          {
            key: 'computed',
            type: 'computed',
            _design: true,
            _bindKey: true,
            props: {
              label: '数值计算',
              typeName: '数值计算',
              icon: 'calculate',
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
      typeName: '位置',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '位置',
          typeName: '位置',
        },
        fieldGroup: [
          {
            key: 'address',
            type: 'address-input',
            _design: true,
            _bindKey: true,
            props: {
              label: '地址输入',
              typeName: '地址输入',
              icon: 'edit_location_alt',
            },
          },
          {
            key: 'map',
            type: 'map-display',
            _design: true,
            _bindKey: true,
            props: {
              label: '地图展示',
              typeName: '地图展示',
              icon: 'map',
            },
          },
          {
            key: 'locationSelect',
            type: 'location-select',
            _design: true,
            _bindKey: true,
            props: {
              label: '位置选择',
              typeName: '位置选择',
              icon: 'my_location',
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
      typeName: '子表',
      wrapperAttr: {
        backgroundColor: '#f1f4fc',
      },
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
          typeName: '输入：',
        },
        fieldGroup: [
          {
            key: 'normalInput',
            type: 'subtable',
            _design: true,
            _bindKey: true,
            props: {
              label: '普通输入',
              typeName: '普通输入子表',
              icon: 'subtitles',
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                _bindKey: true,
                props: {
                  row: 1,
                  appearance: 'fill',
                  label: '单行文本',
                  typeName: '单行文本',
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
          typeName: '弹窗：',
        },
        fieldGroup: [
          {
            key: 'popupList',
            type: 'popup-list',
            _design: true,
            _bindKey: true,
            props: {
              label: '弹窗列表选择',
              typeName: '弹窗列表选择',
              icon: 'view_list',
            },
          },
          {
            key: 'popupForm',
            type: 'popup-form',
            _design: true,
            _bindKey: true,
            props: {
              label: '弹窗表单输入',
              typeName: '弹窗表单输入',
              icon: 'view_stream',
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
      typeName: '展示',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '展示：',
          typeName: '展示：',
        },
        fieldGroup: [
          {
            key: 'button',
            type: 'button',
            _design: true,
            props: {
              type: 'basic',
              label: '按钮',
              typeName: '按钮',
              icon: 'crop_landscape',
            },
          },
          {
            key: 'textDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '文本',
              typeName: '文本',
              icon: 'text_format',
            },
          },
          {
            key: 'imageDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '图片',
              typeName: '图片',
              icon: 'image',
            },
          },
          {
            key: 'rectangle',
            type: 'display',
            _design: true,
            props: {
              label: '矩形',
              typeName: '矩形',
              icon: 'crop_3_2',
            },
          },
        ],
      },
    ],
  },
];
