import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { MenuService } from '@src/app/core/services/menu.service';
import { IMenuNode, IMenuType } from '@src/app/shared/models/app-menu.model';
import { MenuToggleComponent } from './menu-toggle.component';
import { MenuLinkComponent } from './menu-link.component';

@Component({
  selector: 'hs-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less'],
  imports: [MenuToggleComponent, MenuLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
  IMenuType = IMenuType;

  menuData = computed(() => this.menuService.menuData());

  constructor(private menuService: MenuService) {}

  trackByMenuSection(index: number, section: IMenuNode) {
    return section.id;
  }

  ngOnInit() {}
}
