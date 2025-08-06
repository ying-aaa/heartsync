import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

export const tabs_config: IEditorFormlyField[] = [
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
          defaultAddValue: {
            _design: true,
            type: 'column',
            props: {
              label: '新页签',
              typeName: '新页签',
              icon: 'dehaze',
              density: 1,
              styles: {
                rowGap: 12,
                rowGapUnits: 'px',
              },
            },
            fieldGroup: [],
          },
          // 最后一条数据时是否允许删除
          canRemoveLast: false,
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
