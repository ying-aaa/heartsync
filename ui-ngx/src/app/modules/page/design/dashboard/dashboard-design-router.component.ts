import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';

@Component({
  selector: 'hs-dashboard-design-router',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
  providers: [DashboardConfigService, DashboardEditorService],
})
export class DashboardDesignRouterComponent {}
