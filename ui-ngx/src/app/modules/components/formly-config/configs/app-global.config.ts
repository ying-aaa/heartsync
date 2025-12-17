import { IEditorFormlyField } from '@src/app/shared/models/public-api';
import { enhanceFieldData } from './public-api';

export const app_global_config: IEditorFormlyField[] = enhanceFieldData([
  {
    key: 'backgroundImage',
    type: 'image-upload',
    defaultValue: [],
    props: { label: '背景图片', description: '请上传图片', maxCount: 1 },
  },
]);
