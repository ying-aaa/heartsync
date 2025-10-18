import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { input_config } from './input.config';
import { grid_config } from './grid.config';
import { flex_config } from './flex.config';
import { textarea_config } from './textarea.config';
import { tabs_config } from './tabs.config';
import { button_config } from './button.config';
import { fieldset_config } from './fieldset.config';
import { subtable_config } from './subtable.config';
import { select_config } from './select.config';
import { widget_config } from './widget.config';
import { radio_config } from './radio.config';
import { menu_signle_config } from './menu-signle.config';

export const CONFIT_RESOURCE: { [key: string]: IEditorFormlyField[] } = {
  input: input_config,
  textarea: textarea_config,
  button: button_config,
  grid: grid_config,
  flex: flex_config,
  fieldset: fieldset_config,
  tabs: tabs_config,
  subtable: subtable_config,
  select: select_config,
  radio: radio_config,
  widget: widget_config,
  // 单个菜单配置
  menuSingle: menu_signle_config,
};
