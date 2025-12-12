import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { SystemOptionComponent } from '../../workbench/page/system/common/system-option/system-option.component';

@Component({
  selector: 'hs-data-asset-design-router',
  template: `
    <content class="wh-full flex">
      <aside class="w-284px pt-12px px-16px pb-24px h-full">
        <hs-system-option></hs-system-option>
      </aside>
      <mat-divider vertical="true"></mat-divider>
      <main class="w-0 flex-1 h-full">
        <router-outlet></router-outlet>
      </main>
    </content>
  `,
  imports: [SystemOptionComponent, RouterModule, MatDividerModule],
})
export class DataAssetDesignRouterComponent {
  constructor() {}

  ngOnInit() {}
}
