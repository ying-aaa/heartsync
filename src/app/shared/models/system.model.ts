export enum IThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum IPrefixes {
  COMMON = "HS-",
}

export interface ICatalogStructure {
  name: string;
  id?: string;
  level: number;
  expandable: boolean;
  isExpanded?: boolean;
  children?: ICatalogStructure[];
}