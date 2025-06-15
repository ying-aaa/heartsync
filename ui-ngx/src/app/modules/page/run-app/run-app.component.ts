import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { MenuService } from '@src/app/core/services/menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [SideMenuComponent, RouterModule, MatDividerModule],
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.menuService.loadMenuData(this.appId!);
  }
}
