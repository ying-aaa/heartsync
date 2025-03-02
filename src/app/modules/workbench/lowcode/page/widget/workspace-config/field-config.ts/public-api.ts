import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { widget_input_config } from './input-config';
import { widget_grid_config } from './grid-config';
import { widget_flex_config } from './flex-config';
import { widget_fieldset_config } from './group-config';

export const CONFIT_RESOURCE: { [key: string]: IEditorFormlyField[] } = {
  input: widget_input_config,
  grid: widget_grid_config,
  flex: widget_flex_config,
  fieldset: widget_fieldset_config,
};
