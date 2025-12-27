import { Component, effect, input, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { RoleUserListComponent } from './role-user-list/role-user-list.component';
import { IRoleMapping } from '@src/app/shared/models/user.model';
import { UserHttpService } from '@src/app/core/http/user.service';
import { RoleMappingComponent } from './role-mapping/role-mapping.component';
import { RoleLiitosrooliComponent } from './role-liitosrooli/role-liitosrooli.component';
import { GroupsAttributesComponent } from './role-attributes/role-attributes.component';

@Component({
  selector: 'hs-role-detail',
  templateUrl: './role-detail.component.html',
  imports: [
    MatTabsModule,
    RoleUserListComponent,
    RoleMappingComponent,
    RoleLiitosrooliComponent,
    GroupsAttributesComponent,
  ],
})
export class RoleDetailComponent implements OnInit {
  roleId = input<string | null>(null);

  roleMapping = signal<IRoleMapping | null>(null);

  constructor(
    private route: ActivatedRoute,
    private userHttpService: UserHttpService,
  ) {
    effect(() => {
      const roleId = this.roleId();
      roleId && this.loadRoleMapping();
    });
  }

  loadRoleMapping() {
    this.userHttpService.getRealmRoleById(this.roleId()!).subscribe({
      next: (roleMapping: IRoleMapping) => {
        this.roleMapping.set(roleMapping);
      },
    });
  }

  ngOnInit() {}
}
