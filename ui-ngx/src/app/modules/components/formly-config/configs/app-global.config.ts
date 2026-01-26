import { IEditorFormlyField } from '@src/app/shared/models/public-api';
import { enhanceFieldData } from './public-api';

export const app_global_config: IEditorFormlyField[] = enhanceFieldData([
  {
    key: 'appLayoutType',
    type: 'select',
    defaultValue: 'default',
    props: {
      label: '布局',
      typeName: '下拉单选',
      icon: 'view_column',
      disabled: false,
      appearance: 'outline',
      styles: {
        heightUnits: 'px',
        border: '1px solid var(--base-color-10)',
        borderRadius: 8,
        borderRadiusUnits: 'px',
      },
      options: [
        {
          label: '默认布局',
          value: 'default',
        },
        {
          label: '左右布局',
          value: 'left-right',
        },
      ],
    },
  },
  {
    key: 'globalContainerStyle.backgroundImage',
    type: 'image-upload',
    defaultValue: [],
    props: { label: '背景图片', description: '请上传图片', maxCount: 1 },
  },
  {
    key: 'customAppGlobalCssText',
    type: 'json-object',
    fieldId: 'input_key_2579558739748954',
    props: {
      type: 'css',
      label: '在线css样式编辑',
      typeName: 'json编辑器',
      icon: 'text_fields',
      disabled: false,
      appearance: 'outline',
      styles: {
        height: 320,
        heightUnits: 'px',
        border: '1px solid var(--base-color-10)',
        borderRadius: 8,
        borderRadiusUnits: 'px',
        overflow: 'hidden',
      },
      title: '在线css样式编辑',
      layout: 'float',
    },
  },
]);
