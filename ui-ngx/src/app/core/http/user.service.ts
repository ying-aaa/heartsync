import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import {
  IUserInfo,
  IUserRequiredAction,
} from '@src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  private realm = 'keycloak-angular-sandbox';

  constructor(private http: HttpClient) {}

  getUsers(pageLink: PageLink) {
    const params = pageLink.toQueryHttp();

    return this.http.get<Array<IUserRequiredAction>>(
      `/uc/admin/realms/${this.realm}/ui-ext/brute-force-user?briefRepresentation=true
      `,
      { params },
    );
  }

  createUser(userInfo: IUserInfo) {
    return this.http.post<IUserInfo>('/uc/admin/realms/master/users', userInfo);
  }

  getUserRequiredCtions() {
    return this.http.get<Array<any>>(
      `/uc/admin/realms/master/authentication/required-actions`,
    );
  }
}
