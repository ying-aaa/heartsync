// src/app/user-info-edit/user-info-edit.component.ts
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '@src/app/core/auth/user.service';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { ToastrService } from 'ngx-toastr';

export interface EditFieldData {
  field: string;
  value: string | null;
  label: string;
}

@Component({
  selector: 'hs-user-info-edit',
  template: `
    <div mat-dialog-title>修改{{ data.label }}</div>
    <mat-dialog-content class="pt-20px! mb-40px!">
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full hs-density--5">
          <input
            matInput
            [type]="inputType"
            formControlName="value"
            [placeholder]="'请输入' + data.label"
          />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>取消</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">
        保存
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class UserInfoEditComponent {
  form: FormGroup;
  inputType: string = 'text';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EditFieldData,
    private dialogRef: MatDialogRef<UserInfoEditComponent>,
    private userService: UserService,
    private toastrService: ToastrService,
    private authHttpService: AuthHttpService,
  ) {
    // 根据字段类型设置 input 类型
    switch (data.field) {
      case 'email':
        this.inputType = 'email';
        break;
      case 'phoneNumber':
        this.inputType = 'tel';
        break;
      case 'description':
        this.inputType = 'textarea';
        break;
      default:
        this.inputType = 'text';
    }

    this.form = this.fb.group({
      value: [data.value || '', this.getValidators()],
    });
  }

  private getValidators() {
    if (this.data.field === 'email') {
      return [Validators.required, Validators.email];
    }
    return [Validators.required];
  }

  onSave() {
    const { id, firstName, email, emailVerified, userProfileMetadata, attributes } =
      this.userService.userProfile()!;
    const isAttributes = !['firstName', 'email'].includes(this.data.field);
    let userInfo: any = {
      id,
      firstName,
      email,
      emailVerified,
      userProfileMetadata,
      attributes,
    };
    if (isAttributes) {
      userInfo.attributes = {
        ...userInfo.attributes,
        [this.data.field]: [this.form.value.value],
      };
    } else {
      userInfo = { ...userInfo, [this.data.field]: this.form.value.value };
    }
    this.authHttpService.updateUserInfo(userInfo).subscribe(
      (res) => {
        // 这里不调用接口重新请求了
        const userProfile = this.userService.userProfile()!;
        const tokenParsed = this.userService.tokenParsed()!;
        this.userService.updateUser({ ...userProfile, ...userInfo }, tokenParsed);
        this.toastrService.success('修改成功');
        this.dialogRef.close(true);
      },
      (err) => {
        this.toastrService.error(err.errorMessage || '修改失败');
      },
    );
  }
}
