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
import { VerseThemeComponent } from '@src/app/shared/components/ui-verse/verse-theme/verse-theme.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hs-workbench-header',
  templateUrl: './workbench-header.component.html',
  styleUrls: ['./workbench-header.component.less'],
  imports: [
    MatButtonModule,
    RouterModule,
    MatSlideToggleModule,
    MatRippleModule,
    VerseThemeComponent,
    MatIconModule,
    MatDividerModule,
  ],
})
export class WorkbenchHeaderComponent {
  outlet = input<RouterOutlet>();
  logoSkip = input<string | null>();

  menuList: Route[] = [];
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
