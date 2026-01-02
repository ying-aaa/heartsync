import { IAnyPropObj } from './system.model';

// ----------------- 用户管理 -----------------
export interface IUserInfo {
  id: string;
  attributes: IUserInfoAttributes;
  requiredActions: any[];
  emailVerified: boolean;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
  groups: any[];
  enabled: boolean;
  createdTimestamp: number;
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

export interface IGroupRoleMappings {
  clientMappings: IClientMappings;
}

export interface IClientMappings {
  [key: string]: IClientMappingsAccount;
}

export interface IClientMappingsAccount {
  id: string;
  client: string;
  mappings: IRoleInfo[];
}

export interface IRoleInfo {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
  attributes?: IAnyPropObj;
}

export interface IRoleMapping {
  realmMappings: IRoleInfo[];
  clientMappings: IClientMappings;
}

/**
 * 角色组合信息
 */
export interface IKcComposites {
  /**
   * 领域角色 ID 列表
   */
  realm?: string[];

  /**
   * 客户端角色 ID 列表（键为客户端 ID，值为角色 ID 数组）
   */
  client?: { [clientId: string]: string[] };
}

/**
 * RoleRepresentation
 */
export interface IRoleRepresentation {
  /**
   * 角色 ID
   */
  id?: string;

  /**
   * 角色名称
   */
  name: string;

  /**
   * 角色描述
   */
  description?: string;

  /**
   * 是否需要作用域参数
   */
  scopeParamRequired?: boolean;

  /**
   * 是否为组合角色
   */
  composite?: boolean;

  /**
   * 组合角色的子角色信息
   */
  composites?: IKcComposites;

  /**
   * 是否为客户端角色
   */
  clientRole?: boolean;

  /**
   * 容器 ID（通常是客户端 ID 或领域 ID）
   */
  containerId?: string;

  /**
   * 角色属性（键值对）
   */
  attributes?: { [key: string]: string[] };
}

export interface IUserCredential {
  id: string;
  type: string;
  userLabel: string;
  createdDate: string;
  data: any;
}
