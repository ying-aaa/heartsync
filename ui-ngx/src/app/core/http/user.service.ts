import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  private realm = 'keycloak-angular-sandbox';

  constructor(private http: HttpClient) {}

  getUsers(pageLink: PageLink) {
    const params = pageLink.toQueryHttp();

    return this.http.get<Array<any>>(
      `/uc/admin/realms/${this.realm}/ui-ext/brute-force-user?briefRepresentation=true
      `,
      { params },
    );
  }
}
