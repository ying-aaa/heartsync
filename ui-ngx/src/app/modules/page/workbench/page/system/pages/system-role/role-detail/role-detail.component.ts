import { Component, effect, input, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { RoleUserListComponent } from './user/role-user-list.component';
import { IRoleMapping } from '@src/app/shared/models/user.model';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { RoleMappingComponent } from './mapping/role-mapping.component';
import { RoleLiitosrooliComponent } from './liitosrooli/role-liitosrooli.component';
import { GroupsAttributesComponent } from './attributes/role-attributes.component';
import { tap } from 'rxjs';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { RolePermissionComponent } from './permission/role-permission.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hs-role-detail',
  templateUrl: './role-detail.component.html',
  imports: [
    MatTabsModule,
    RoleUserListComponent,
    RoleMappingComponent,
    RoleLiitosrooliComponent,
    GroupsAttributesComponent,
    RolePermissionComponent,
    HsLoadingModule,
    MatIconModule,
  ],
})
export class RoleDetailComponent implements OnInit {
  roleId = input<string | null>(null);

  roleMapping = signal<IRoleMapping | null>(null);

  isLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private authHttpService: AuthHttpService,
  ) {
    effect(() => {
      const roleId = this.roleId();
      roleId && this.loadRoleMapping();
    });
  }

  loadRoleMapping() {
    this.isLoading.set(true);
    this.authHttpService
      .getRealmRoleById(this.roleId()!)
      .pipe(
        tap(() => {
          setTimeout(() => {
            this.isLoading.set(false);
          }, 500);
        }),
      )
      .subscribe({
        next: (roleMapping: IRoleMapping) => {
          this.roleMapping.set(roleMapping);
        },
      });
  }

  ngOnInit() {}
}
