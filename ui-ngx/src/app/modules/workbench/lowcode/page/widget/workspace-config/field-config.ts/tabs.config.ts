import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

export const widget_tabs_config: IEditorFormlyField[] = [
  {
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
              key: 'props.label',
              type: 'input',
              props: {
                type: 'text',
                label: '选项名称',
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
