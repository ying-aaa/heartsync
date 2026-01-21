export const IAPP_LAYOUT_TYPES = ['default', 'left-right'] as const;

export type IAppLayoutType = (typeof IAPP_LAYOUT_TYPES)[number]; // 等价于 'default' | 'left-right'

export const IHEADER_CONTENT_ITEM_TYPES = [
  'logo',
  'userInfo',
  'placeholder',
  'fullscreen',
  'theme',
  'message',
  'customWidget',
] as const;

export enum ISoftDeleteStatus {
  UNDELETED = 0,
  DELETED = 1,
}

export type IHeaderContentItemType =
  (typeof IHEADER_CONTENT_ITEM_TYPES)[number];

export interface IMenuItemStyle {
  default: Record<string, string>;
  hover: Record<string, string>;
  active: Record<string, string>;
}

export interface IHeaderContentItem {
  type: 'text' | 'icon';
  text?: string;
  icon?: string;
}

export interface IAppGlobalConfig {
  appId: string;
  appLayoutType: IAppLayoutType;
  globalContainerStyle: {
    backgroundImage: Array<Record<string, string>>;
  };
  customAppGlobalCssText: string;
}

export interface IAppMenuConfig {
  appId: string;
  menuThemeId: string;
  parentMenuItemStyle: IMenuItemStyle;
  childMenuItemStyle: IMenuItemStyle;
  menuContainerStyle: Record<string, string>;
}

export interface IAppHeaderConfig {
  headerContainerStyle: Record<string, string>;
  headerContentItems: IHeaderContentItem[];
}
