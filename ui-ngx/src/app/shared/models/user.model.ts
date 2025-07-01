export interface IUserRequiredAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: IUserRequiredActionConfig;
  label?: string;
}

export interface IUserRequiredActionConfig {
  [key: string]: any;
}

export interface IUserInfo {
  attributes: IUserInfoAttributes;
  requiredActions: any[];
  emailVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
  groups: any[];
  enabled: boolean;
}

export interface IUserInfoAttributes {
  locale: string;
}
