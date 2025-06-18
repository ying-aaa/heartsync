import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { VerseThemeComponent } from "@shared/components/ui-verse/verse-theme/verse-theme.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule, VerseThemeComponent],
})
export class DashboardPageComponent implements OnInit {
  dashboardId: string;
  private routeSub: Subscription | null = null;


  constructor(    
    private route: ActivatedRoute,
  ) {
      this.routeSub = this.route.params.subscribe(params => {
      const dashboardId = params['dashboardId']; 
      console.log("%c Line:24 🥝 dashboardId", "color:#f5ce50", dashboardId);
      if (dashboardId !== this.dashboardId) {
        this.dashboardId = dashboardId;
        this.updateComponent(dashboardId); 
      }
    });
  }

  
  updateComponent(dashboardId: string): void {
    console.log('路由参数更新，执行更新逻辑，当前 ID:', dashboardId);
  }

  ngOnInit() {

  }
}
