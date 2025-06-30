import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';

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
      routerLink="{{ 'dashboard/' + section.id }}"
      [style.paddingLeft.px]="level * 30 || 8"
      (click)="onMenuClick()"
    >
      @if (section.icon !== null) {
        <mat-icon class="hs-menu-icon"> description </mat-icon>
      }
      <span>{{ section.name }}</span>
    </a>
  `,
  imports: [MatTreeModule, MatIconModule, RouterModule],
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
