import { Component, Inject, input, model, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IUserInfo } from '@src/app/shared/models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserCredentialsComponent } from '../credentials/user-credentials.component';
import { UserRoleMappingsComponent } from '../../../common/system-role/system-role-mappings.component';
import { UserDeparmentComponent } from '../deparment/user-deparment.component';
import { UserSessionsComponent } from '../sessions/user-sessions.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';

@Component({
  selector: 'hs-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [
    MatTabsModule,
    MatIconModule,
    HsLoadingModule,
    MatDividerModule,
    MatDialogTitle,
    MatDialogContent,
    UserFormComponent,
    UserCredentialsComponent,
    UserRoleMappingsComponent,
    UserDeparmentComponent,
    UserSessionsComponent,
    MatButtonModule,
  ],
})
export class UserDetailComponent implements OnInit {
  isLoading = signal<boolean>(false);

  userId = model<string | null>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userInfo: IUserInfo },
    public matDialogRef: MatDialogRef<UserDetailComponent>,
    private authHttpService: AuthHttpService,
  ) {
    if (data.userInfo) {
      this.userId.set(data.userInfo.id);
    }
  }

  simulationUser() {
    if (window.confirm('确定要模拟登录此用户吗？')) {
      this.authHttpService.simulationUser(this.userId()!).subscribe((res) => {
        window.open(res.redirect);
      });
    }
  }

  ngOnInit() {}
}
