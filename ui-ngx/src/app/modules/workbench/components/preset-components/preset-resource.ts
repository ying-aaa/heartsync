import { generateUUID } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
export const presetResource: IEditorFormlyField[] = [
  {
    key: 'layout',
    type: 'group', // 使用 group 类型
    _design: true,
    props: {
      label: '布局',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '布局器：',
        },
        fieldGroup: [
          {
            key: 'grid',
            type: 'grid',
            _design: true,
            props: {
              label: '栅格',
              icon: 'grid_on',
              styles: {
                gap: '10',
                gapUnits: 'px',
              },
            },
            fieldGroup: [
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 1,
                },
              },
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 2,
                },
              },
              {
                _design: true,
                key: 'column',
                type: 'column',
                fieldGroup: [],
                props: {
                  row: 3,
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
            },
            fieldGroup: [
              {
                key: 'grid',
                type: 'grid',
                _design: true,
                props: {
                  label: '栅格',
                  icon: 'apps',
                },
                fieldGroup: [
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    props: {
                      row: 8,
                    },
                    fieldGroup: [],
                  },
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    props: {
                      row: 8,
                    },
                    fieldGroup: [],
                  },
                  {
                    _design: true,
                    key: 'column',
                    type: 'column',
                    props: {
                      row: 8,
                    },
                    fieldGroup: [],
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
              orientation: 'mixed',
              styles: {
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                rowGap: 10,
                rowGapUnits: 'px',
                columnGap: 10,
                columnGapUnits: 'px',
                justifycontent: 'center',
                alignitems: 'center',
                paddingLeft: 8,
                paddingLeftUnits: 'px',
                paddingTop: 8,
                paddingTopUnits: 'px',
                paddingRight: 8,
                paddingRightUnits: 'px',
                paddingBottom: 8,
                paddingBottomUnits: 'px',
              },
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  label: '第一个文本',
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
            },
            fieldGroup: [
              {
                key: 'input',
                type: 'input',
                _design: true,
                props: {
                  type: 'text',
                  label: '第一个文本',
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
        },
        fieldGroup: [
          {
            key: 'tabs',
            type: 'tabs',
            _design: true,
            props: {
              label: '页签',
              icon: 'tab',
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
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
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
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
            },
            fieldGroup: [
              {
                key: 'column',
                type: 'column',
                _design: true,
                props: {
                  label: '第一个',
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第一个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第二个文本',
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
                },
                fieldGroup: [
                  {
                    key: 'input',
                    type: 'input',
                    _design: true,
                    props: {
                      type: 'text',
                      label: '第三个文本',
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
      //   },
      //   fieldGroup: [
      //     {
      //       key: 'title',
      //       type: 'title',
      //       _design: true,
      //       props: {
      //         label: '标题',
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
    props: {
      label: '输入',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
        },
        fieldGroup: [
          {
            key: 'text',
            type: 'input',
            _design: true,
            props: {
              type: 'text',
              label: '单行文本',
            },
          },
          {
            key: 'textarea',
            type: 'textarea',
            _design: true,
            props: {
              label: '多行文本',
            },
          },
          {
            key: 'number',
            type: 'input',
            _design: true,
            props: {
              type: 'number',
              label: '数字',
            },
          },
          {
            key: 'password',
            type: 'input',
            _design: true,
            props: {
              type: 'password',
              label: '密码',
            },
          },
          {
            key: 'color',
            type: 'input',
            _design: true,
            props: {
              type: 'color',
              label: '颜色',
            },
          },
          {
            key: 'datepicker',
            type: 'datepicker',
            _design: true,
            props: {
              label: '日期',
            },
          },
          {
            key: 'richText',
            type: 'rich-text', // 假设你有富文本组件
            _design: true,
            props: {
              label: '富文本',
            },
          },
          {
            key: 'draw',
            type: 'draw', // 假设你有手绘组件
            _design: true,
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
    _design: true,
    props: {
      label: '选择',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '选择：',
        },
        fieldGroup: [
          {
            key: 'radio',
            type: 'radio',
            _design: true,
            props: {
              label: '单选',
            },
          },
          {
            key: 'checkbox',
            type: 'checkbox',
            _design: true,
            props: {
              label: '多选',
            },
          },
          {
            key: 'toggle',
            type: 'toggle',
            _design: true,
            props: {
              label: '开关',
            },
          },
          {
            key: 'select',
            type: 'select',
            _design: true,
            props: {
              label: '下拉单选',
            },
          },
          {
            key: 'select_multi',
            type: 'select',
            _design: true,
            props: {
              label: '下拉多选',
            },
          },
          {
            key: 'slider',
            type: 'slider',
            _design: true,
            props: {
              label: '滑块',
            },
          },
          {
            key: 'rating',
            type: 'rating',
            _design: true,
            props: {
              label: '评分',
            },
          },
          {
            key: 'tree-select',
            type: 'tree-select',
            _design: true,
            props: {
              label: '下拉树形',
            },
          },
          {
            key: 'popup-select',
            type: 'popup-select',
            _design: true,
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
    _design: true,
    props: {
      label: '上传',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '上传：',
        },
        fieldGroup: [
          {
            key: 'photo',
            type: 'file-upload',
            _design: true,
            props: {
              label: '照片',
            },
          },
          {
            key: 'file',
            type: 'file-upload',
            _design: true,
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
    _design: true,
    props: {
      label: '系统',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '系统：',
        },
        fieldGroup: [
          {
            key: 'user',
            type: 'system-user',
            _design: true,
            props: {
              label: '用户',
            },
          },
          {
            key: 'organization',
            type: 'system-organization',
            _design: true,
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
    _design: true,
    props: {
      label: '位置',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '位置',
        },
        fieldGroup: [
          {
            key: 'address',
            type: 'address-input',
            _design: true,
            props: {
              label: '地址输入',
            },
          },
          {
            key: 'map',
            type: 'map-display',
            _design: true,
            props: {
              label: '地图展示',
            },
          },
          {
            key: 'locationSelect',
            type: 'location-select',
            _design: true,
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
    _design: true,
    props: {
      label: '子表',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '输入：',
        },
        fieldGroup: [
          {
            key: 'normalInput',
            type: 'input',
            _design: true,
            props: {
              label: '普通输入',
            },
          },
        ],
      },
      {
        _design: true,
        props: {
          label: '弹窗：',
        },
        fieldGroup: [
          {
            key: 'popupList',
            type: 'popup-list',
            _design: true,
            props: {
              label: '弹窗列表选择',
            },
          },
          {
            key: 'popupForm',
            type: 'popup-form',
            _design: true,
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
    _design: true,
    props: {
      label: '展示',
    },
    fieldGroup: [
      {
        _design: true,
        props: {
          label: '展示：',
        },
        fieldGroup: [
          {
            key: 'textDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '文本',
            },
          },
          {
            key: 'imageDisplay',
            type: 'display',
            _design: true,
            props: {
              label: '图片',
            },
          },
          {
            key: 'rectangle',
            type: 'display',
            _design: true,
            props: {
              label: '矩形',
            },
          },
        ],
      },
    ],
  },
];
