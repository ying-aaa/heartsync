import { Component, OnInit } from '@angular/core';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { IAppConfig } from '@src/app/core/http/application.service';
import { AppLayoutComponent } from './layout/app-layout.component';

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [RouterModule, MatDividerModule, AppLayoutComponent],
  host: { class: 'hs-run-app-container block wh-full' },
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);

  constructor(
    private route: ActivatedRoute,
    private runAppMenuService: RunAppMenuService,
  ) {}

  ngOnInit() {
    this.runAppMenuService.loadAppAndMenu(this.appId!).subscribe({
      next: ([appConfig, menuData]: [IAppConfig, IMenuNode[]]) => {},
      error: (err) => {},
    });
  }
}
