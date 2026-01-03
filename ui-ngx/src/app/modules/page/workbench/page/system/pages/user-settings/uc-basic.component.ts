// src/app/uc-basic/uc-basic.component.ts
import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { UserService } from '@src/app/core/auth/user.service';
import { ResetPasswordComponent } from '../system-user/reset-password/reset-password.component';
import { UserInfoEditComponent } from './uc-info-edit.component';

@Component({
  selector: 'hs-uc-basic',
  template: `
    <div class="wh-full">
      <div class="text-15px opacity-90 mb-4">
        <span class="hs-title-botomm-border">用户信息</span>
      </div>
      <mat-list role="list" class="mb-12px!">
        @for (item of userInfoFields; track $index) {
          <mat-list-item role="listitem">
            <span class="inline-block w-30% color-[var(--primary-text-color)]">{{
              item.label
            }}</span>
            @if (item.field === 'avatar') {
              <img
                src="/assets/workbench/hs.jpg"
                MatListItemAvatar
                class="w-32px h-32px rounded-5px"
              />
            } @else {
              <span class="inline-block w-50%">{{ item.value() || '-' }}</span>
            }

            @if (item.canEdit) {
              <button
                mat-button
                class="absolute! right-0 top-50% -translate-y-50%"
                (click)="onEditField(item)"
              >
                修改
              </button>
            }
          </mat-list-item>
        }
      </mat-list>

      <div class="text-15px opacity-90 mb-4">
        <span class="hs-title-botomm-border">系统信息</span>
      </div>
      <mat-list role="list" class="mb-12px!">
        @for (item of systemInfoFields; track $index) {
          <mat-list-item role="listitem">
            <span class="inline-block w-30% color-[var(--primary-text-color)]">{{
              item.label
            }}</span>
            <span class="inline-block w-50% whitespace-pre-wrap">{{ item.value() || '-' }}</span>
            <button
              mat-button
              class="absolute! right-0 top-50% -translate-y-50%"
              (click)="onViewDetail(item)"
            >
              详情
            </button>
          </mat-list-item>
        }
      </mat-list>
    </div>
  `,
  imports: [MatListModule, MatDividerModule, MatButtonModule],
})
export class UcBasicComponent {
  // 用户信息字段列表
  userInfoFields = [
    {
      field: 'avatar',
      label: '头像',
      value: computed(() => this.userService.avatar()),
      canEdit: true,
    },

    {
      field: 'username',
      label: '用户名',
      value: computed(() => this.userService.username()),
    },
    {
      field: 'firstName',
      label: '名称',
      value: computed(() => this.userService.nickname()),
      canEdit: true,
    },
    {
      field: 'jobNumber',
      label: '工号',
      value: computed(() => this.userService.jobNumber()),
      canEdit: true,
    },
    {
      field: 'email',
      label: '邮箱',
      value: computed(() => this.userService.email()),
      canEdit: true,
    },
    {
      field: 'phoneNumber',
      label: '手机号',
      value: computed(() => this.userService.phoneNumber()),
      canEdit: true,
    },
    {
      field: 'description',
      label: '个人简介',
      value: computed(() => this.userService.description()),
      canEdit: true,
    },
  ];

  // 系统信息字段列表
  systemInfoFields = [
    { label: '角色', value: computed(() => this.userService.roles()) },
    { label: '部门', value: computed(() => this.userService.groupsPaths()) },
  ];

  constructor(
    private dialog: MatDialog,
    private readonly userService: UserService,
  ) {}

  onEditField(item: any) {
    const dialogRef = this.dialog.open(UserInfoEditComponent, {
      width: '600px',
      data: {
        field: item.field,
        value: item.value(),
        label: item.label,
      },
    });

    dialogRef.afterClosed().subscribe((newValue) => {
      if (newValue !== undefined) {
        // 调用 userService 更新对应字段
      }
    });
  }

  onViewDetail(item: any) {
    // 可以跳转到详情页或弹出详情对话框
    alert(`查看 ${item.label} 详情: ${item.value}`);
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '600px',
      data: { userInfo: this.userService.userProfile() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 处理密码重置结果
      }
    });
  }
}
