import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

export const widget_grid_config: IEditorFormlyField[] = [
  {
    _design: false,
    key: 'props.styles.gap',
    type: 'number',
    props: {
      label: '间距',
      appearance: 'outline',
    },
    className: 'hs-density--5',
  },
  {
    type: 'fieldset',
    props: {
      label: '群组',
      icon: 'subheader',
    },
    fieldGroup: [
      {
        key: 'fieldGroup',
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
              templateOptions: {
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
