import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';

@Component({
  selector: 'hs-dashboard-viewport',
  templateUrl: './dashboard-viewport.component.html',
  imports: [MatButtonModule, DashboardLayoutComponent],
})
export class DashboardViewportComponent implements OnInit {
  constructor(private router: Router) {}

  toDashboardDesign() {
    const dashboardId = 1;
    this.router.navigate([`/design/dashboard/layout`], {
      queryParams: { dashboardId },
    });
  }

  ngOnInit() {}
}
