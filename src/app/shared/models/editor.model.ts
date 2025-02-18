import { FormlyFieldConfig } from '@ngx-formly/core';

export enum IFieldType {
  GROUP = 'group',
  ROW = 'row',
  COL = 'col',
}

export interface IEditorFormlyField extends FormlyFieldConfig {
  /**
   * 组件的显示名称
   */
  label?: string;
  fieldGroup?: IEditorFormlyField[];
  fieldId?: string;
  parentFieldId?: string;
  canHaveChildren?: boolean;
  childrenPath?: string; // Lodash path
  _design?: boolean;
}
