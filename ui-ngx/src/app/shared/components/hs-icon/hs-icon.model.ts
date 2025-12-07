export type IIconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone';

export interface IBaseIconConfig {
  iconSize: number;
  bgSize: number;
  backgroundColor?: string;
}

export interface IMatIconConfig extends IBaseIconConfig {
  type: IIconType;
  name: string;
  color: string;
}

export interface ICustomIconConfig extends IBaseIconConfig {
  type: 'custom';
  url: string;
}

export type IIconConfig = IMatIconConfig | ICustomIconConfig;
