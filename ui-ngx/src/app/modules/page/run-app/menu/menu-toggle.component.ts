import { ChangeDetectionStrategy, Component, computed, Input, OnInit } from '@angular/core';
import { IMenuNode, IMenuType } from '@src/app/shared/models/app-menu.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { VerseTreeTogglerSwitchComponent } from '@shared/components/ui-verse/verse-tree-toggler-switch/verse-tree-toggler-switch.component';
import { HsIconComponent } from '@src/app/shared/components/hs-icon/hs-icon.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
@Component({
  selector: 'hs-menu-toggle',
  template: `
    <a
      mat-button
      class="hs-menu-link hs-menu-item-parent"
      [class.hs-menu-active]="selectedMenuId() === section.id"
      [style.paddingLeft.px]="level * 30 || 8"
      (click)="onMenuClick()"
    >
      @if (section.icon !== null) {
        <hs-icon [iconConfig]="section.icon" [isDesign]="false"></hs-icon>
      }
      <span>{{ section.name }}</span>
    </a>

    <verse-tree-toggler-switch
      [isChecked]="isExpanded"
      class="absolute top-50% -translateY-50% right-16px"
    ></verse-tree-toggler-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterModule, VerseTreeTogglerSwitchComponent, HsIconComponent],
  host: {
    class: 'block relative',
  },
})
export class MenuToggleComponent implements OnInit {
  @Input() section: IMenuNode;
  @Input() level: number;
  @Input() isExpanded: boolean;

  IMenuType = IMenuType;

  selectedMenuId = computed(() => this.runAppMenuService.selectedMenuId());

  constructor(private runAppMenuService: RunAppMenuService) {}

  toggleSection(event: Event) {}

  onMenuClick() {
    localStorage.setItem('selectedMenuId', this.section.id || 'not-found');
  }

  ngOnInit(): void {}
}
