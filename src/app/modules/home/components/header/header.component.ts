import { AfterViewInit, Component, computed, effect, input, Signal } from '@angular/core';
import {
  ActivatedRoute,
  Route,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'hs-header',
  templateUrl: './header.component.html',
  imports: [MatButtonModule, RouterModule],
})
export class HeaderComponent {
  menuList: Route[] = [];
  outlet = input<RouterOutlet>();

  constructor(private route: ActivatedRoute) {
    this.menuList = this.route.routeConfig!.children!.filter(
      (item) => item.data?.['use'] === IRouterUse.MENU,
    )!;
  }
}
