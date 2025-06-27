import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'hs-uc-third-party',
  template: `
    <content class="wh-full">
      <div class="text-14px opacity-90">绑定后可使用第三方账户进行登录</div>
      <mat-list
        role="list"
        class="mb-12px!"
      >
        <mat-list-item role="listitem">
          <img
            src="https://th.bing.com/th/id/ODLS.f8b0bfee-f356-42b7-b0f4-cb7656b969a7"
            MatListItemAvatar
            class="w-32px h-32px rounded-5px mr-8px"
          />
          <span class="inline-block w-30% line-height-24px">微信</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
            绑定
          </button>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item role="listitem">
          <img
            src="https://th.bing.com/th/id/ODLS.b2099a11-ca12-45ce-bede-5df940e38a48"
            MatListItemAvatar
            class="w-32px h-32px rounded-5px mr-8px"
          />
          <span class="inline-block w-30% line-height-24px">Github</span>
          <button
            mat-button
            MatListItemMeta
            class="absolute! right-0 top-50% -translate-y-50%"
          >
           绑定
          </button>
        </mat-list-item>
      </mat-list>
    </content>
  `,
  imports: [MatListModule, MatIconModule, MatDividerModule, MatButtonModule],
})
export class UcThirdPartyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}