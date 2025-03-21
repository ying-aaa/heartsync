import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { widget_input_config } from './input.config';
import { widget_grid_config } from './grid.config';
import { widget_flex_config } from './flex.config';
import { widget_textarea_config } from './textarea.config';
import { widget_tabs_config } from './tabs.config';
import { widget_button_config } from './button.config';
import { widget_fieldset_config } from './fieldset.config';
import { widget_subtable_config } from './subtable.config';
import { widget_form_config } from './form.config';
import { widget_select_config } from './select.config';

export const CONFIT_RESOURCE: { [key: string]: IEditorFormlyField[] } = {
  input: widget_input_config,
  textarea: widget_textarea_config,
  button: widget_button_config,
  grid: widget_grid_config,
  flex: widget_flex_config,
  fieldset: widget_fieldset_config,
  tabs: widget_tabs_config,
  subtable: widget_subtable_config,
  form: widget_form_config,
  select: widget_select_config,
};
