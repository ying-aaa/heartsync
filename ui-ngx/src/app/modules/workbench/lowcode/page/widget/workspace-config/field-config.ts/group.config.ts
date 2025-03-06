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
    type: 'fieldset',
    props: {
      label: '间距',
      icon: 'subheader',
      styles: {
        fontSize: 14,
        fontSizeUnits: 'px',
      },
    },
    fieldGroup: [
      {
        type: 'grid',
        props: {
          label: '栅格',
          icon: 'apps',
          styles: {
            gap: '10',
            gapUnits: 'px',
          },
        },
        fieldGroup: [
          {
            type: 'column',
            props: {
              row: 12,
            },
            fieldGroup: [
              {
                key: 'fieldGroup[0].props.styles.columnGap',
                type: 'number',
                props: {
                  label: '水平间距',
                  appearance: 'outline',
                },
                className: 'hs-density--5',
              },
            ],
          },
          {
            type: 'column',
            props: {
              row: 12,
            },
            fieldGroup: [
              {
                key: 'fieldGroup[0].fieldGroup[0].props.styles.rowGap',
                type: 'number',
                props: {
                  label: '垂直间距',
                  appearance: 'outline',
                },
                className: 'hs-density--5',
              },
            ],
          },
        ],
      },
    ],
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
