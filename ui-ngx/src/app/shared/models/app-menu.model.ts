export enum IMenuType {
  Parent = 'parent',
  Child = 'child',
  UrlRedirect = 'urlRedirect',
  AppRedirect = 'appRedirect',
}

export interface IMenuNode {
  id: string;
  name: string;
  icon: string;
  menuType: IMenuType;
  parentMenuId: string | null;
  isFullscreen: boolean;
  sort: number;
  dashboardId: string | null;
  url?: string;
  appId?: string;
  children?: IMenuNode[];
  externalLink?: string;
  visible?: boolean;
  authRoles?: string[];
}
