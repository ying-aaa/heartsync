import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkbenchHeaderComponent } from '../workbench/components/workbench-header/workbench-header.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'hs-design',
  templateUrl: './design.component.html',
  imports: [WorkbenchHeaderComponent, RouterModule],
})
export class DesignComponent implements OnInit {
  @ViewChild('outlet', { static: true }) outlet!: RouterOutlet;
  hiddenMenu = false;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.onActivate();
    }, 50);
  }
  onActivate() {
    const routeConfig = this.outlet.activatedRoute.routeConfig;
    this.hiddenMenu = routeConfig?.data?.['hiddenMenu'];
  }
}
