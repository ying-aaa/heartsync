import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'hs-dashboard-viewport',
  templateUrl: './dashboard-viewport.component.html',
  imports: [MatButtonModule],
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
