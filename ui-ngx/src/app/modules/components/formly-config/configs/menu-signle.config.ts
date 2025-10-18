import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

export const menu_signle_config: IEditorFormlyField[] = [
  {
    key: 'name',
    type: 'input',
    props: {
      type: 'text',
      label: '菜单名称',
      placeholder: '',
      disabled: false,
      appearance: 'outline',
      density: 5,
      description: '',
      required: false,
      readonly: false,
    },
    className: 'hs-density--5 ',
  },
];
