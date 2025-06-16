import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule],
})
export class DashboardPageComponent implements OnInit {
  dashboardId: string | null = getParamFromRoute('dashboardId', this.route);

  constructor(    
    private router: Router,
    private route: ActivatedRoute,
    ) {}

  ngOnInit() {}
}
