import { Component, Inject, input, OnInit, signal } from '@angular/core';
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
import { CreateUserComponent } from '../create-user/create-user.component';

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
    CreateUserComponent,
  ],
})
export class UserDetailComponent implements OnInit {
  isLoading = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userInfo: IUserInfo },
    public matDialogRef: MatDialogRef<UserDetailComponent>,
  ) {}

  ngOnInit() {}
}
