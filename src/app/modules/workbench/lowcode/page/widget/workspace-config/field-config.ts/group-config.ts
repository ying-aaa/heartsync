import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

export const widget_fieldset_config: IEditorFormlyField[] = [
  {
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
    key: 'fieldGroup[0].props.styles.gap',
    type: 'number',
    props: {
      label: '间距',
      appearance: 'outline',
      min: 0,
      max: undefined,
    },
    className: 'hs-density--5',
  },
  {
    key: 'fieldGroup[0].fieldGroup',
    type: 'fieldset',
    props: {
      label: '列配置',
      icon: 'subheader',
      styles: {
        fontSize: 14,
        fontSizeUnits: 'px',
      },
    },
    fieldGroup: [
      {
        type: 'array',
        props: {
          label: '宽度',
          appearance: 'outline',
        },
        className: 'hs-density--5',
        fieldArray: {
          fieldGroup: [
            {
              key: 'props.row',
              type: 'input',
              props: {
                type: 'number',
                label: '列宽',
                min: 1,
                max: 24,
              },
            },
          ],
        },
      },
    ],
  },
];
