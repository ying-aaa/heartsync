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
import { component_action_config } from './node-component-action.config';
import { variables_config } from './node-variables.config';
import { menu_global_config } from './menu-global.config';

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
  // 全局菜单配置
  menuGlobal: menu_global_config,
  // 组件动作配置
  componentAction: component_action_config,
  variables: variables_config,
};
