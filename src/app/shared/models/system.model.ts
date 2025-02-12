export enum IThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum IPrefixes {
  COMMON = 'HS-',
}

export interface ICatalogStructure {
  name: string;
  key?: string | number;
  children?: ICatalogStructure[];
}

export interface IRadioConfig {
  label: string;
  value: string;
}

export enum IEventsType {
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseUp = 'mouseup',
  KeyDown = 'keydown',
  KeyUp = 'keyup',
  Click = 'click',
}
