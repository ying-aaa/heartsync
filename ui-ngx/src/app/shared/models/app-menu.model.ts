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
  dashboardId: string | null;
  sort: number;
  url?: string;
  appId?: string;
  children?: IMenuNode[];
  externalLink?: string;
  visible?: boolean;
  authRoles?: string[];
  version?: number;
}
