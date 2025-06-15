import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule],
})
export class DashboardPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
}
