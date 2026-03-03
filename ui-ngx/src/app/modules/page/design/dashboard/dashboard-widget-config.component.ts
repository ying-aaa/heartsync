import { Component, computed, input, OnInit } from '@angular/core';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'hs-dashboard-widget-config',
  template: `
    <content class="flex flex-col h-full">
      <div class="flex items-center p-8px justify-end">
        <button mat-button class="mr-8px">
          <mat-icon>close</mat-icon>
          取消
        </button>
        <button mat-flat-button>
          <mat-icon>check</mat-icon>
          应用
        </button>
      </div>
      <mat-tab-group
        class="flex-1"
        mat-stretch-tabs="false"
        mat-align-tabs="start"
        class="wh-full hs-tab-item-indicator-full"
      >
        <mat-tab label="部件配置">
          <hs-formly-config
            class="flex-1 py-8px px-24px"
            [type]="'dashboardWidget'"
          ></hs-formly-config>
        </mat-tab>
        <mat-tab label="前置数据">
          <div class="flex-center wh-full text-36px color-#666">开发中...</div>
        </mat-tab>
      </mat-tab-group>
    </content>
  `,
  imports: [FormlyConfigComponent, FormlyRunModule, MatIcon, MatButton, MatTabsModule],
})
export class DashboardWidgetConfigComponent implements OnInit {
  ngOnInit() {}
}
