export type IMatIconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone';
export type IIconType = 'custom' | 'mat-icon';

export interface IBaseIconConfig {
  type: IIconType;
  iconSize: number;
  bgSize: number;
  backgroundColor?: string;
}

export interface IMatIconConfig extends IBaseIconConfig {
  matIconType: IMatIconType;
  name: string;
  color: string;
}

export interface ICustomIconConfig extends IBaseIconConfig {
  url: string;
}

export type IIconConfig = IMatIconConfig | ICustomIconConfig;
