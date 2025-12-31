import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tab',
  template: `<mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" class="wh-full hs-tab-item-indicator-full">
    <mat-tab class="color-[var(--title-text-color)]!">
      <ng-template mat-tab-label>
        <mat-icon class="text-20px w-20px! h-20px! mr-6px"> security </mat-icon>
        <span>权限</span> </ng-template
      >你好世界1
    </mat-tab>
    <mat-tab class="color-[var(--title-text-color)]!">
      <ng-template mat-tab-label>
        <mat-icon class="text-20px w-20px! h-20px! mr-6px"> person </mat-icon>
        <span>用户</span>
      </ng-template>
      你好世界2
    </mat-tab>
  </mat-tab-group>`,
  styles: `
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    // ::ng-deep .mdc-tab-indicator {
    // }
    // ::ng-deep .mdc-tab-indicator .mdc-tab-indicator__content.mdc-tab-indicator__content--underline {
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   left: 0;
    //   top: 0;
    //   background-color: #999;
    // }
  `,
  imports: [MatIconModule, MatTabsModule],
})
export class TabComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
