import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

export const widget_textarea_config: IEditorFormlyField[] = [
  {
    _design: false,
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
    _design: false,
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
    key: 'props.rows',
    type: 'number',
    props: {
      appearance: 'outline',
      label: '行数',
      min: 1,
      max: undefined,
      options: [
        { value: 'fill', label: '填满' },
        { value: 'outline', label: '线条' },
      ],
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
];
