import { Component, Inject, input, model, OnInit, ViewChild } from '@angular/core';
import { PasswordFormComponent } from '../password-form/password-form.component';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { IUserInfo } from '@src/app/shared/models/user.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'hs-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    PasswordFormComponent,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
  ],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(PasswordFormComponent) passwordFormComponent!: PasswordFormComponent;

  username = model();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userInfo: IUserInfo },
    public matDialogRef: MatDialogRef<ResetPasswordComponent>,
    private authHttpService: AuthHttpService,
    private toastrService: ToastrService,
  ) {
    const username = this.data.userInfo?.username;
    username && this.username.set(username);
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.passwordFormComponent.isValid()) {
      this.passwordFormComponent.markAllAsTouched();
      return;
    }

    const userId = this.data.userInfo.id;
    const password = this.passwordFormComponent.getPassword()!;
    const temporary = this.passwordFormComponent.getTemporary();
    this.authHttpService.resetUserPassword(userId, password, temporary).subscribe((res) => {
      this.toastrService.success('密码重置成功');
      this.matDialogRef.close(true);
    });
  }
}
