import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hs-dashboard-design-router',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class DashboardDesignRouterComponent{}
