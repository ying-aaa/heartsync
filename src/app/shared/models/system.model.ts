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
  children?: ICatalogStructure[];
}
export enum IEventsType {
  MouseDown = "mousedown",
  MouseMove = "mousemove",
  MouseUp = "mouseup",
  KeyDown = "keydown",
  KeyUp = "keyup"
}