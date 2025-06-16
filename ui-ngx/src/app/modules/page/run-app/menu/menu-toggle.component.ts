import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IMenuNode, IMenuType } from '@src/app/shared/models/app-menu.model';
import { MenuLinkComponent } from './menu-link.component';
import { MatIconModule } from '@angular/material/icon';
import { SideMenuComponent } from "./side-menu.component";
@Component({
  selector: 'hs-menu-toggle',
  templateUrl: './menu-toggle.component.html',
  styleUrls: ['./menu-toggle.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MenuLinkComponent],
})
export class MenuToggleComponent implements OnInit {
  @Input() section: IMenuNode;

  IMenuType = IMenuType;

  toggleSection(event: Event) {}

  ngOnInit(): void {}
}
