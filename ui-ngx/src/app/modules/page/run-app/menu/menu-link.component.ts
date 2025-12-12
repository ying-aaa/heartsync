import { ChangeDetectionStrategy, Component, computed, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { HsIconComponent } from '@src/app/shared/components/hs-icon/hs-icon.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';

@Component({
  selector: 'hs-menu-link',
  template: `
    <a
      mat-button
      class="hs-menu-link hs-menu-item-children"
      [class.hs-menu-active]="selectedMenuId() === section.id"
      [style.paddingLeft.px]="leftPadding()"
      (click)="onMenuClick()"
    >
      @if (section.icon !== null) {
        <hs-icon [iconConfig]="section.icon" [isDesign]="false"></hs-icon>
      }
      <span>{{ section.name }}</span>
    </a>
  `,
  imports: [MatTreeModule, MatIconModule, HsIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent implements OnInit {
  @Input() section: IMenuNode;
  @Input() level: number;

  selectedMenuId = computed(() => this.runAppMenuService.selectedMenuId());

  leftPadding = computed(() => {
    const menuConfig = this.runAppGlobalService.appMenuConfig();
    return this.level * menuConfig.menuContainer?.levelPadding || 8;
  });

  constructor(
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  onMenuClick() {
    this.runAppMenuService.navigateMenuById(this.section.id);
  }

  ngOnInit() {}
}
