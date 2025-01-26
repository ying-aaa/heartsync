export enum IThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum IPrefixes {
  COMMON = "HS-",
}

export interface ICatalogStructure {
  name: string;
  key?: string;
  children?: ICatalogStructure[];
}