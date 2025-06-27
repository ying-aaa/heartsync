import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'hs-uc-basic',
  template: `
    <content class="wh-full">
      <div class="text-15px opacity-90">
        <span class="hs-title-botomm-border">用户信息</span>
      </div>
      <mat-list
        role="list"
        class="mb-12px!"
      >
        <mat-list-item role="listitem">
          <span class="inline-block w-30% line-height-24px">头像</span>
          <img
            src="/assets/workbench/hs.jpg"
            MatListItemAvatar
            class="w-32px h-32px rounded-5px"
          />
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">名称</span>
          <span>不读诗意</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">账户</span>
          <span>heart</span>
          <!-- <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button> -->
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">密码</span>
          <span>******</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">邮箱</span>
          <span>{{ '775296271@qq.com' }}</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">手机号</span>
          <span> 19513015537 </span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">邮箱</span>
          <span>{{ '775296271@qq.com' }}</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">个人简介</span>
          <span>有空一起吃个火锅不喽！</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
      </mat-list>

      <div class="text-15px opacity-90">
        <span class="hs-title-botomm-border">系统信息</span>
      </div>
      <mat-list
        role="list"
        class="mb-12px!"
      >
        <mat-list-item role="listitem">
          <span class="inline-block w-30% line-height-24px">角色</span>
          <span class="inline-block w-50%"
            >系统管理员, 管理员，普通用户，研发主管</span
          >
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            详情
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <span class="inline-block w-30%">部门</span>
          <span class="inline-block w-50%"
            >/随心公司/软件研发部/前端开发部</span
          >
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            修改
          </button>
        </mat-list-item>
      </mat-list>
    </content>
  `,
  imports: [MatListModule, MatIconModule, MatDividerModule, MatButtonModule],
})
export class UcBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
