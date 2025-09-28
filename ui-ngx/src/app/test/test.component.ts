import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { IRouterUse } from '../shared/models/route.model';
import { HsThemeService } from '../core/services/theme.service';

@Component({
  selector: 'hs-workbench',
  template: `
    <div class="p-20px  flex color-#fff">
      @for (item of menuList; track $index) {
        @let isActiveRoute =
          item.path === outlet!.activatedRoute.routeConfig?.path;
        <div
          class="h-40px line-height-40px rounded-8px mx-3px"
          [class]="{
            'bg-#2F90B9': isActiveRoute,
            'hover:bg-#2F90B930': !isActiveRoute,
          }"
          matRipple
          matRippleColor="#ffffff20"
        >
          <a
            class="flex items-center w-full h-full px-16px"
            [routerLink]="item.path"
          >
            {{ item.title }}
          </a>
        </div>
      }
    </div>
    <div class="px-20px h-0 flex-1">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styles: `
    :host {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `,
  imports: [RouterModule, CommonModule, MatExpansionModule],
})
export class TestComponent {
  menuList: Route[] = [];

  constructor(
    private route: ActivatedRoute,
    private hsThemeService: HsThemeService,
  ) {
    this.menuList = this.route.routeConfig!.children!.filter(
      (item) => item.data?.['use'] === IRouterUse.MENU,
    )!;
  }
}
