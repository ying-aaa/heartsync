import { IAnyPropObj } from './system.model';

// ----------------- 用户管理 -----------------
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

// ----------------- 群组管理 -----------------

export interface IGroupInfo {
  id: string;
  name: string;
  path: string;
  subGroupCount: number;
  access: IGroupAccess;
  parentId?: string;
  subGroups?: any[];
  attributes?: IGroupAttributes;
  realmRoles?: any[];
  clientRoles?: IGroupClientRoles;
}

export interface IGroupAccess {
  view: boolean;
  viewMembers: boolean;
  manageMembers: boolean;
  manage: boolean;
  manageMembership: boolean;
}

export interface IGroupAttributes extends IAnyPropObj {}

export interface IGroupClientRoles extends IAnyPropObj {}
