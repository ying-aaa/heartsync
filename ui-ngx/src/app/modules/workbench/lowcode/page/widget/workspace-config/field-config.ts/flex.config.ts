import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

export const widget_flex_config: IEditorFormlyField[] = [
  {
    key: 'props.styles.flexDirection',
    type: 'radio',
    props: {
      appearance: 'outline',
      label: '方向',
      options: [
        { value: 'row', label: '横向' },
        { value: 'column', label: '竖向' },
      ],
    },
    className: 'hs-density--5',
  },
  {
    type: 'fieldset',
    props: {
      label: '边距',
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
                key: 'props.styles.paddingLeft',
                type: 'number',
                props: {
                  label: '左',
                  appearance: 'outline',
                },
                className: 'hs-density--5',
              },
              {
                key: 'props.styles.paddingTop',
                type: 'number',
                props: {
                  label: '上',
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
                key: 'props.styles.paddingRight',
                type: 'number',
                props: {
                  label: '右',
                  appearance: 'outline',
                },
                className: 'hs-density--5',
              },
              {
                key: 'props.styles.paddingBottom',
                type: 'number',
                props: {
                  label: '下',
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
                key: 'props.styles.columnGap',
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
                key: 'props.styles.rowGap',
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
];
