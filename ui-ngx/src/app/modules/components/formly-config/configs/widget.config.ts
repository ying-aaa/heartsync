import { deepClone } from '@src/app/core/utils';
import { IEditorFormlyField, IEditSizeType } from '@src/app/shared/models/public-api';

const mobileSizeOptions = [
  {
    value: IEditSizeType.FILL,
    label: '撑满',
    width: 100,
    widthUnits: '%',
    height: 100,
    heightUnits: '%',
  },
  {
    value: IEditSizeType.MOBILE,
    label: '手机',
    width: 375,
    widthUnits: 'px',
    height: 667,
    heightUnits: 'px',
  },
  {
    value: IEditSizeType.IPAD,
    label: '平板',
    width: 1024,
    widthUnits: 'px',
    height: 768,
    heightUnits: 'px',
  },
  {
    value: IEditSizeType.PC,
    label: '电脑',
    width: 1980,
    widthUnits: 'px',
    height: 1020,
    heightUnits: 'px',
  },
  {
    value: IEditSizeType.CUSTOM,
    label: '自定义',
    width: 400,
    widthUnits: 'px',
    height: 400,
    heightUnits: 'px',
  },
];

export const widget_config: IEditorFormlyField[] = [
  {
    key: 'workSizeConfig.type',
    type: 'radio',
    defaultValue: IEditSizeType.FILL,
    props: {
      label: '预览设备尺寸',
      typeName: '单选',
      placeholder: '',
      disabled: false,
      appearance: 'outline',
      density: 5,
      description: '',
      required: false,
      readonly: false,
      options: mobileSizeOptions,
      hideFieldUnderline: true,
      floatLabel: 'always',
      tabindex: -1,
    },
    hooks: {
      onInit: (field) => {
        field.formControl?.valueChanges.subscribe((type: any) => {
          const size = deepClone(mobileSizeOptions?.find((item: any) => item.value === type) || {});
          field.options?.formState.widgetConfig.update((value: any) => {
            return { ...value, workSizeConfig: { ...size, type } };
          });
        });
      },
    },
    className: 'hs-density--5 ',
  },
  {
    type: 'fieldset',
    props: {
      label: '预览宽高设置',
      icon: 'subheader',
      placeholder: '',
      disabled: false,
      density: 1,
      showBorder: true,
      styles: {
        color: '',
        fontSize: 14,
        fontSizeUnits: 'px',
        fontWeight: 400,
        paddingTop: 8,
        paddingTopUnits: 'px',
        paddingBottom: 8,
        paddingBottomUnits: 'px',
        borderRadius: 0,
        borderRadiusUnits: 'px',
        borderColor: '',
        borderWidth: 0,
        borderWidthUnits: 'px',
        borderStyle: 'groove',
      },
    },
    className: 'hs-density--1 ',
    fieldGroup: [
      {
        type: 'grid',
        props: {
          label: '栅格',
          icon: 'grid_on',
          placeholder: '',
          disabled: false,
          density: 1,
          styles: {
            columnGap: 8,
            columnGapUnits: 'px',
          },
        },
        className: 'hs-density--1 ',
        fieldGroup: [
          {
            type: 'column',
            props: {
              row: 1,
              label: '',
              placeholder: '',
              disabled: false,
              density: 1,
              styles: {
                rowGap: 8,
                rowGapUnits: 'px',
              },
            },
            className: 'hs-density--1 ',
            fieldGroup: [
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  placeholder: '',
                  disabled: false,
                  density: 1,
                  styles: {
                    columnGap: 0,
                    columnGapUnits: 'px',
                  },
                },
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    props: {
                      row: 5,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'workSizeConfig.width',
                        type: 'input',
                        defaultValue: 100,
                        props: {
                          type: 'number',
                          label: '宽度',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 4,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'workSizeConfig.widthUnits',
                        type: 'select',
                        defaultValue: '%',
                        props: {
                          label: '单位',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          options: [
                            {
                              value: 'px',
                              label: 'px',
                            },
                            {
                              value: '%',
                              label: '%',
                            },
                          ],
                        },
                        className: 'hs-density--5 ',
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: 'grid',
                props: {
                  label: '栅格',
                  icon: 'grid_on',
                  placeholder: '',
                  disabled: false,
                  density: 1,
                  styles: {
                    columnGap: 0,
                    columnGapUnits: 'px',
                  },
                },
                className: 'hs-density--1 ',
                fieldGroup: [
                  {
                    type: 'column',
                    props: {
                      row: 5,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'workSizeConfig.height',
                        type: 'input',
                        defaultValue: 100,
                        props: {
                          type: 'number',
                          label: '高度',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                        },
                        className: 'hs-density--5 ',
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
                      },
                    ],
                  },
                  {
                    type: 'column',
                    props: {
                      row: 4,
                      label: '',
                      placeholder: '',
                      disabled: false,
                      density: 1,
                      styles: {
                        rowGap: 8,
                        rowGapUnits: 'px',
                      },
                    },
                    className: 'hs-density--1 ',
                    fieldGroup: [
                      {
                        key: 'workSizeConfig.heightUnits',
                        type: 'select',
                        defaultValue: '%',
                        props: {
                          label: '单位',
                          placeholder: '',
                          disabled: false,
                          appearance: 'outline',
                          density: 5,
                          description: '',
                          required: false,
                          readonly: false,
                          options: [
                            {
                              value: 'px',
                              label: 'px',
                            },
                            {
                              value: '%',
                              label: '%',
                            },
                          ],
                        },
                        className: 'hs-density--5 ',
                        expressionProperties: {
                          'props.disabled': (model) => {
                            return model.workSizeConfig?.type !== 'custom';
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
