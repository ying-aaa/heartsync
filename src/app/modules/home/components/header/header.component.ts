import { Component, input } from '@angular/core';
import {
  ActivatedRoute,
  Route,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { IThemeType } from '@src/app/shared/models/system.model';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'hs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  imports: [
    MatButtonModule,
    RouterModule,
    MatSlideToggleModule,
    MatRippleModule,
  ],
})
export class HeaderComponent {
  menuList: Route[] = [];
  outlet = input<RouterOutlet>();
  checked = true;
  constructor(
    private route: ActivatedRoute,
    public hsThemeService: HsThemeService,
  ) {
    this.menuList = this.route.routeConfig!.children!.filter(
      (item) => item.data?.['use'] === IRouterUse.MENU,
    )!;
  }

  toggleChange(event: MatSlideToggleChange) {
    this.hsThemeService.toggleDarkTheme(
      event.checked ? IThemeType.DARK : IThemeType.LIGHT,
    );
  }
}
