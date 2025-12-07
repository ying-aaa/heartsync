import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { HsIconComponent } from '@src/app/shared/components/hs-icon/hs-icon.component';

@Component({
  selector: 'hs-menu-link',
  template: `
    <a
      mat-button
      class="hs-menu-link"
      routerLinkActive="hs-menu-active"
      [routerLinkActiveOptions]="{
        paths: 'subset',
        queryParams: 'ignored',
        matrixParams: 'ignored',
        fragment: 'ignored',
      }"
      routerLink="{{ 'dashboard/' + section.dashboardId }}"
      [style.paddingLeft.px]="level * 30 || 8"
      (click)="onMenuClick()"
    >
      @if (section.icon !== null) {
        <hs-icon [iconConfig]="section.icon"></hs-icon>
      }
      <span>{{ section.name }}</span>
    </a>
  `,
  imports: [MatTreeModule, MatIconModule, RouterModule, HsIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent implements OnInit {
  @Input() section: IMenuNode;
  @Input() level: number;

  appId: string | null = getParamFromRoute('appId', this.route);

  constructor(private route: ActivatedRoute) {}

  onMenuClick() {
    sessionStorage.setItem('selectedMenuId', this.section.id);
  }

  ngOnInit() {}
}
