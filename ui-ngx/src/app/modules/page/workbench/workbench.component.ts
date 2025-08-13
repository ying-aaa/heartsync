import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '@src/environments/environment';
import { WorkbenchHeaderComponent } from '../common/workbench-header/workbench-header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hs-workbench',
  template: `
    <hs-workbench-header [outlet]="outlet"></hs-workbench-header>
    <div class="h-0 flex-1">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styles: `
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `,
  imports: [
    RouterModule,
    CommonModule,
    MatExpansionModule,
    WorkbenchHeaderComponent,
  ],
})
export class WorkbenchComponent {
  constructor(private toastr: ToastrService) {
    this.toastr.success(
      `
      账户/密码：johndoe/admin
    `,
      '系统目前开发进度30%，请使用可用账户登录',
      {
        positionClass: 'toast-top-center',
        // 不消失
        extendedTimeOut: 0,
        // 点击不消失
        tapToDismiss: false,
      },
    );
  }
}
