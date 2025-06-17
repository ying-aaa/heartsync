import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IMenuNode, IMenuType } from '@src/app/shared/models/app-menu.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { VerseTreeTogglerSwitchComponent } from "@shared/components/ui-verse/verse-tree-toggler-switch/verse-tree-toggler-switch.component";
@Component({
  selector: 'hs-menu-toggle',
  template: `
    <a
      mat-button
      class="hs-menu-link"
      routerLinkActive="hs-menu-active"
      [style.paddingLeft.px]="level * 30 || 8"
      (click)="onMenuClick()"
    >
      @if (section.icon !== null) {
        <mat-icon class="hs-menu-icon"> {{ isExpanded ? "folder_open" : "folder_close"}} </mat-icon>
      }
      <span>{{ section.name }}</span>
    </a>

    <verse-tree-toggler-switch 
      [isChecked]="isExpanded" 
      class="absolute top-50% -translateY-50% right-16px"
    ></verse-tree-toggler-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterModule, VerseTreeTogglerSwitchComponent],
  host: {
    class: 'block relative',
  },
})
export class MenuToggleComponent implements OnInit {
  @Input() section: IMenuNode;
  @Input() level: number;
  @Input() isExpanded: boolean;

  IMenuType = IMenuType;

  toggleSection(event: Event) {}

  onMenuClick() {
    localStorage.setItem('selectedMenuId', this.section.id);
  }

  ngOnInit(): void {}
}
