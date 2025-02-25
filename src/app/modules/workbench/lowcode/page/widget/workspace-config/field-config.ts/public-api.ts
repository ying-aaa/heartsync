import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { widget_input_config } from './input-config';
import { widget_grid_config } from './grid-config';

export const CONFIT_RESOURCE: { [key: string]: IEditorFormlyField[] } = {
  input: widget_input_config,
  grid: widget_grid_config,
};
