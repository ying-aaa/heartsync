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

export const IAPP_TYPE = ['web'];

export type IAppType = (typeof IAPP_TYPE)[number];

export type IHeaderContentItemType =
  (typeof IHEADER_CONTENT_ITEM_TYPES)[number];

export enum IAppVersionStatus {
  DRAFT = 0, // 草稿
  PENDING_PUBLISH = 1, // 待发布
  PUBLISHED = 2, // 已发布
  ROLLED_BACK = 3, // 已回滚
}

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

export interface IAppData {
  id: string;
  directoryId: string;
  name: string;
  type: IAppType;
  description: string;
  imageUrl: string;
  tags: Array<string>;
  isDeleted: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  byDepartment: string;
}

export interface IAppVersionData {
  id: string;
  appId: string;
  versionName: string;
  versionCode: string;
  versionDesc: string;
  status: number;
  publishTime: Date;
  publishUserId: string;
  createTime: Date;
}

export interface IAppWithConfig extends IAppData {
  version: IAppVersionData;
  globalConfig: IAppGlobalConfig;
  menuConfig: IAppMenuConfig;
  headerConfig: IAppHeaderConfig;
}
