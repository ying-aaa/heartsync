// password-form.component.ts
import { Component, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SwitchComponent } from '@src/app/shared/components/hs-switch/hs-switch.component';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';

const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9\S]{8,20}$/;

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
  1;
}

@Component({
  selector: 'hs-password-form',
  template: `
    <div [formGroup]="passwordForm">
      <!-- 密码输入 -->
      <div class="flex mb-6 items-center">
        <label class="w-160px text-right mr-20px">
          @if (passwordForm.get('password')!.invalid) {
            <span class="color-red">*</span>
          }
          密码：</label
        >
        <mat-form-field appearance="outline" class="flex-1">
          <input
            matInput
            [type]="hidePassword() ? 'password' : 'text'"
            formControlName="password"
            required
            class="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            mat-icon-button
            matSuffix
            (click)="hidePassword.set(!hidePassword())"
            class="mr-5px"
          >
            <mat-icon class="text-20px! w-20px! h-20px! color-[var(--primary-text-color)]">{{
              hidePassword() ? 'visibility_off' : 'visibility'
            }}</mat-icon>
          </button>
          @let passwordRequired = passwordForm.get('password')?.errors?.['required'];
          @if (passwordRequired) {
            <mat-error class="text-red-500"> 密码是必填项 </mat-error>
          }
          @let isPassword = passwordForm.get('password')?.errors?.['pattern'];
          @if (isPassword) {
            <mat-error class="text-red-500"> 密码必须至少8位，包含字母、数字 </mat-error>
          }
        </mat-form-field>
      </div>

      <!-- 确认密码输入 -->
      <div class="flex mb-6 items-center">
        <label class="w-160px text-right mr-20px">
          @if (passwordForm.get('confirmPassword')!.invalid) {
            <span class="color-red">*</span>
          }
          确认密码：</label
        >
        <mat-form-field appearance="outline" class="flex-1">
          <input
            matInput
            [type]="hideConfirmPassword() ? 'password' : 'text'"
            formControlName="confirmPassword"
            required
            class="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            mat-icon-button
            matSuffix
            (click)="hideConfirmPassword.set(!hideConfirmPassword())"
            class="mr-5px"
          >
            <mat-icon class="text-20px! w-20px! h-20px! color-[var(--primary-text-color)]">{{
              hideConfirmPassword() ? 'visibility_off' : 'visibility'
            }}</mat-icon>
          </button>
          @if (passwordForm.get('confirmPassword')?.hasError('required')) {
            <mat-error>请确认密码</mat-error>
          } @else if (passwordForm.get('confirmPassword')?.hasError('pattern')) {
            <mat-error>密码格式不正确</mat-error>
          } @else if (passwordForm.hasError('passwordMismatch')) {
            <mat-error>两次输入的密码不一致</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="flex mb-6 items-center">
        <label class="w-160px text-right mr-20px flex items-center justify-end">
          @let emailTooltip = '开启后，用户下次登录需要修改当前密码';
          <mat-icon [matTooltip]="emailTooltip" class="text-18px! p-3px cursor-pointer">
            question_mark
          </mat-icon>
          临时密码：
        </label>
        <hs-switch formControlName="temporary"></hs-switch>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SwitchComponent,
  ],
})
export class PasswordFormComponent {
  passwordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordRegex),
      ]),
      temporary: new FormControl(false),
    },
    { validators: passwordMatchValidator },
  );

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(private authHttpService: AuthHttpService) {}

  getPassword(): string | null {
    return this.passwordForm.get('password')?.value!;
  }

  getTemporary(): boolean {
    return this.passwordForm.get('temporary')?.value!;
  }

  isValid(): boolean {
    return this.passwordForm.valid;
  }

  markAllAsTouched(): void {
    this.passwordForm.markAllAsTouched();
  }
}
