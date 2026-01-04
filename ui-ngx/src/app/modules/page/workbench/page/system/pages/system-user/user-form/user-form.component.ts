import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { IUserInfo, IUserRequiredAction } from '@src/app/shared/models/user.model';
import { userRequiredCtions } from '../data';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChipsAutocompleteComponent } from '@shared/components/hs-chips-autocomplete/hs-chips-autocomplete.component';
import { finalize, map, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PasswordFormComponent } from '../password-form/password-form.component';
import { SwitchComponent } from '@src/app/shared/components/hs-switch/hs-switch.component';
import { DatePipe } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { HS_BUCKET } from '@src/app/shared/models/public-api';
import { IFileData } from '@src/app/shared/models/common-component';

const nameRegex = /^[a-zA-Z\u4e00-\u9fa5\s'-.]+$/;
const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_]*$/;
const phoneNumberRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

@Component({
  selector: 'hs-user-form',
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    ChipsAutocompleteComponent,
    MatError,
    MatDialogModule,
    PasswordFormComponent,
    SwitchComponent,
    DatePipe,
    NgScrollbarModule,
    HsLoadingModule,
    HsUploadFileModule,
  ],
})
export class UserFormComponent implements OnInit {
  @ViewChild(PasswordFormComponent) passwordFormComponent!: PasswordFormComponent;

  bucket = HS_BUCKET;
  folderName = 'common-images';

  isEdit = input<boolean>(false);

  userId = input<string | null>(null);

  userFormRef = new FormGroup({
    requiredActions: new FormControl<any[]>([]),
    emailVerified: new FormControl(),
    firstName: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    username: new FormControl('', [Validators.required, Validators.pattern(usernameRegex)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avater: new FormControl<IFileData[]>([]),
    jobNumber: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.pattern(phoneNumberRegex)]),
    description: new FormControl(''),
    groups: new FormControl([]),
  });

  userRuquiredActions = signal<IUserRequiredAction[]>([]);

  userInfo = signal<IUserInfo>({} as IUserInfo);

  isLoading = signal(false);

  constructor(
    private dialogRef: MatDialogRef<UserFormComponent>,
    private authHttpService: AuthHttpService,
    private toastrService: ToastrService,
  ) {
    this.userFormRef.valueChanges.subscribe((values) => {
      console.log('Form updated:', values);
    });
  }

  onSubmit() {
    if (!this.isEdit()) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  // 创建用户并重置密码
  createUser() {
    if (!this.passwordFormComponent.isValid()) {
      this.passwordFormComponent.markAllAsTouched();
      return;
    }

    if (this.userFormRef.valid) {
      const userInfo: IUserInfo = this.userFormRef.value as any;

      userInfo.attributes = {
        avater: [this.userFormRef.value.avater![0]?.url || ''],
        jobNumber: [this.userFormRef.value.jobNumber || ''],
        phoneNumber: [this.userFormRef.value.phoneNumber || ''],
        description: [this.userFormRef.value.description || ''],
      };

      Reflect.deleteProperty(userInfo, 'avater');
      Reflect.deleteProperty(userInfo, 'jobNumber');
      Reflect.deleteProperty(userInfo, 'phoneNumber');
      Reflect.deleteProperty(userInfo, 'description');

      const password = this.passwordFormComponent?.getPassword()!;
      const temporary = this.passwordFormComponent?.getTemporary();

      userInfo.enabled = true;

      this.authHttpService
        .createUser(userInfo)
        .pipe(
          switchMap((response) => {
            console.log('返回结果:', response);
            this.dialogRef.close(true);
            this.toastrService.success('用户创建成功');
            const userId = response!.substring(response!.lastIndexOf('/') + 1);
            return this.authHttpService.resetUserPassword(userId, password, temporary);
          }),
        )
        .subscribe({
          next: () => {},
          error: (err) => {
            console.error('操作失败:', err);
            this.toastrService.error('操作失败，请重试');
          },
        });
    } else {
      console.log('表单校验未通过');
      this.userFormRef.markAllAsTouched();
    }
  }

  // 编辑用户
  updateUser() {
    if (this.userFormRef.valid) {
      const userInfo: any = { ...this.userInfo(), ...this.userFormRef.value };
      userInfo.attributes = {
        ...userInfo.attributes,
        avater: [this.userFormRef.value.avater![0]?.url || ''],
        jobNumber: [this.userFormRef.value.jobNumber || ''],
        phoneNumber: [this.userFormRef.value.phoneNumber || ''],
        description: [this.userFormRef.value.description || ''],
      };

      Reflect.deleteProperty(userInfo, 'avater');
      Reflect.deleteProperty(userInfo, 'jobNumber');
      Reflect.deleteProperty(userInfo, 'phoneNumber');
      Reflect.deleteProperty(userInfo, 'description');

      this.authHttpService.resetUserInfo(this.userId()!, userInfo).subscribe({
        next: () => {
          this.toastrService.success('用户更新成功');
          this.initUserInfo();
        },
        error: (err) => {
          console.error('操作失败:', err);
          this.toastrService.error('操作失败，请重试');
        },
      });
    }
  }

  loadUserRequiredActions() {
    this.authHttpService
      .getUserRequiredCtions()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const actionLabel = userRequiredCtions.find(
              (item) => item.providerId === action.providerId,
            )?.label;
            if (actionLabel) {
              action.label = actionLabel;
            }
            return action;
          });
        }),
      )
      .subscribe((actions) => {
        this.userRuquiredActions.set(actions);
      });
  }

  initUserInfo() {
    this.isLoading.set(true);
    this.authHttpService
      .getUserInfo(this.userId()!)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe((res) => {
        console.log('%c 🌽 userInfo', 'color:#ea7e5c', res);
        const { attributes } = res;
        this.userInfo.set(res);
        this.userFormRef.patchValue({
          requiredActions: res.requiredActions || [],
          emailVerified: res.emailVerified,
          firstName: res.firstName,
          username: res.username,
          email: res.email,
          avater: [{ id: 'user-avatar', name: 'user-avatar', url: attributes.avater?.[0] || '' }],
          jobNumber: attributes.jobNumber?.[0],
          phoneNumber: attributes.phoneNumber?.[0],
          description: attributes.description?.[0],
        });
      });
  }

  ngOnInit() {
    this.loadUserRequiredActions();
    if (this.isEdit()) {
      this.initUserInfo();
    }
  }
}
