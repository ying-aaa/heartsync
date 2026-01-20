import { Component, computed, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DashboardDesignComponent } from './dashboard-design.component';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';

@Component({
  selector: 'hs-dashboard-viewport',
  templateUrl: './dashboard-viewport.component.html',
  imports: [MatButtonModule, DashboardDesignComponent],
})
export class DashboardViewportComponent implements OnInit {
  isMobile = input.required<boolean>();

  currentDashboardName = computed(() => this.dashboardEditorService.currentDashboardName());
  isDesign = computed(() => !this.dashboardEditorService.isRuntime());

  constructor(
    private router: Router,
    private dashboardEditorService: DashboardEditorService,
  ) {}

  get dashboardId() {
    return this.dashboardEditorService.currentDashboardId();
  }

  toDashboardDesign() {
    const dashboardId = 1;
    this.router.navigate([`/design/dashboard/layout`], {
      queryParams: { dashboardId },
    });
  }

  ngOnInit() {}
}
