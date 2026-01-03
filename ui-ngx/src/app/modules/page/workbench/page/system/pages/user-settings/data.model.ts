export enum IFolderKey {
  Basic = 'basic',
  ThirdParty = 'thirdParty',
  ApiToken = 'apiToken',
  Notifications = 'notifications',
  Appearance = 'appearance',
  General = 'general',
  Shortcuts = 'shortcuts',
  About = 'about',
}

export interface Section {
  key?: IFolderKey;
  name: string;
  icon?: string;
  type: 'title' | 'item';
}

export const folders: Section[] = [
  {
    name: '账号信息',
    type: 'title',
  },
  {
    key: IFolderKey.Basic,
    name: '基本设置',
    icon: 'person',
    type: 'item',
  },
  // {
  //   key: IFolderKey.ThirdParty,
  //   name: "第三方账号绑定",
  //   icon: "link",
  //   type: "item"
  // },
  // {
  //   key: IFolderKey.ApiToken,
  //   name: "API 访问令牌",
  //   icon: "vpn_key",
  //   type: "item"
  // },
  // {
  //   key: IFolderKey.Notifications,
  //   name: "通知",
  //   icon: "notifications",
  //   type: "item"
  // },
  // {
  //   name: "偏好设置",
  //   type: "title"
  // },
  // {
  //   key: IFolderKey.Appearance,
  //   name: "外观",
  //   icon: "brightness_7",
  //   type: "item"
  // },
  // {
  //   key: IFolderKey.General,
  //   name: "通用",
  //   icon: "settings",
  //   type: "item"
  // },
  // {
  //   key: IFolderKey.Shortcuts,
  //   name: "快捷键",
  //   icon: "keyboard",
  //   type: "item"
  // },
  // {
  //   key: IFolderKey.About,
  //   name: "关于 HeartSync",
  //   icon: "info",
  //   type: "item"
  // }
  // {
  //   key: "certificates",
  //   name: "证书管理",
  //   icon: "security",
  //   type: "item"
  // },
  // {
  //   key: "plugins",
  //   name: "插件管理",
  //   icon: "extension",
  //   type: "item"
  // },
  // {
  //   key: "external",
  //   name: "外部程序",
  //   icon: "open_in_new",
  //   type: "item"
  // },
  // {
  //   key: "laboratory",
  //   name: "实验性功能",
  //   icon: "science",
  //   type: "item"
  // },
];
