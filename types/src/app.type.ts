import { IBaseData, ISoftDeleteStatus } from './system.type';

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
  default: {
    [key: string]: any;
  };
  hover: {
    [key: string]: any;
  };
  active: {
    [key: string]: any;
  };
}

export interface IHeaderContentItem {
  type: IHeaderContentItemType;
  styles?: {
    [key: string]: any;
  };
}

export interface IAppBaseConfig {
  id: string;
  appId: string;
  versionId: string;
  createTime: Date;
  updateTime: Date;
  isDeleted?: ISoftDeleteStatus;
}

export interface IAppGlobalConfig extends IAppBaseConfig {
  appLayoutType: IAppLayoutType;
  globalContainerStyle: {
    backgroundImage: Array<Record<string, any>>;
  };
  customAppGlobalCssText: string;
}

export interface IAppMenuConfig extends IAppBaseConfig {
  menuThemeId: string;
  parentMenuItemStyle: IMenuItemStyle;
  childMenuItemStyle: IMenuItemStyle;
  menuContainerStyle: Record<string, any>;
}

export interface IAppHeaderConfig extends IAppBaseConfig {
  headerContainerStyle: Record<string, any>;
  headerContentItems: IHeaderContentItem[];
  createTime: Date;
  updateTime: Date;
}

export interface IAppData extends IBaseData {
  directoryId: string;
  name: string;
  type: IAppType;
  description: string;
  versions?: Array<IAppVersionData>;
  imageUrl: string;
  tags: Array<string>;
}

export interface IAppVersionData {
  id: string;
  appId: string;
  app?: IAppData;
  versionName: string;
  versionCode: string;
  versionDesc: string;
  status: IAppVersionStatus;
  publishTime: Date;
  publishUserId: string;
  createTime: Date;
}

export interface IAppConfig {
  globalConfig: IAppGlobalConfig;
  menuConfig: IAppMenuConfig;
  headerConfig: IAppHeaderConfig;
}

export interface IAppWithConfig extends IAppData, IAppConfig {
  version: IAppVersionData;
}
