import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import {
  IGroupInfo,
  IGroupRoleMappings,
  IRoleMapping,
  IUserInfo,
  IUserRequiredAction,
} from '@src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  private realm = 'keycloak-angular-sandbox';

  constructor(private http: HttpClient) {}
  // ----------------- 用户管理 -----------------
  // 获取用户列表
  getUsers(pageLink: PageLink) {
    const params = pageLink.toQueryHttp();

    return this.http.get<Array<IUserRequiredAction>>(
      `/uc/admin/realms/${this.realm}/ui-ext/brute-force-user?briefRepresentation=true
      `,
      { params },
    );
  }

  // 创建用户
  createUser(userInfo: IUserInfo) {
    return this.http.post<IUserInfo>('/uc/admin/realms/master/users', userInfo);
  }

  // 创建用户时选择的用户必需操作
  getUserRequiredCtions() {
    return this.http.get<Array<any>>(
      `/uc/admin/realms/master/authentication/required-actions`,
    );
  }

  // ----------------- 群组管理 -----------------
  // 获取群组列表
  getGroups(params: any = {}) {
    return this.http.get<Array<IGroupInfo>>(
      `/uc/admin/realms/${this.realm}/groups`,
      {
        params,
      },
    );
  }

  // 获取子群组
  getSubGroups(groupId: string, params: any = {}) {
    return this.http.get<Array<IGroupInfo>>(
      `/uc/admin/realms/${this.realm}/groups/${groupId}/children`,
      { params },
    );
  }

  // 获取群组成员
  getGroupMembers(groupId: string, params: any = {}) {
    return this.http.get<Array<IUserInfo>>(
      `/uc/admin/realms/${this.realm}/groups/${groupId}/members`,
      { params },
    );
  }

  // 获取群组属性
  getGroupAttributes(groupId: string, params: any = {}) {
    return this.http.get<IGroupInfo>(
      `/uc/admin/realms/${this.realm}/groups/${groupId}`,
      { params },
    );
  }

  // 获取群组角色映射
  getGroupRoleMappings(groupId: string, params: any = {}) {
    return this.http.get<IGroupRoleMappings>(
      `/uc/admin/realms/${this.realm}/groups/${groupId}/role-mappings`,
      { params },
    );
  }

  // ----------------- 领域角色 -----------------
  // 获取领域角色
  getRealmRoles(pageLink: PageLink) {
    const params = pageLink.toQueryHttp();
    params.set('first', 0);
    params.set('max', 101);

    return this.http.get<Array<any>>(`/uc/admin/realms/${this.realm}/roles`, {
      params,
    });
  }

  // 根据角色id获取领域角色详情
  getRealmRoleById(id: string) {
    return this.http.get<IRoleMapping>(
      `/uc/admin/realms/${this.realm}/roles-by-id/${id}`,
    );
  }

  // 根据角色id获取角色关联的角色
  getRoleLiitosrooliById(id: string, pageLink: PageLink) {
    console.log("%c Line:107 🌶", "color:#465975");
    const params = pageLink.toQueryHttp();
    return this.http.get<IRoleMapping[]>(
      `/uc/admin/realms/${this.realm}/roles-by-id/${id}/composites`,
      {
        params,
      },
    );
  }

  // 获取领域角色下的用户
  getRealmRoleUsers(roleName: string, pageLink: PageLink) {
    const params = pageLink.toQueryHttp();

    return this.http.get<Array<any>>(
      `/uc/admin/realms/${this.realm}/roles/${roleName}/users`,
      {
        params,
      },
    );
  }

  // 获取领域角色的属性
  getRealmRoleAttributes(roleName: string) {
    return this.http.get<IRoleMapping>(
      `/uc/admin/realms/${this.realm}/roles/${roleName}`,
    );
  }
}
