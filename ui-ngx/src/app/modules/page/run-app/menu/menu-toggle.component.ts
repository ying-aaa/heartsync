import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IMenuNode, IMenuType } from '@src/app/shared/models/app-menu.model';
import { MenuLinkComponent } from './menu-link.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'hs-menu-toggle',
  templateUrl: './menu-toggle.component.html',
  styleUrls: ['./menu-toggle.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class MenuToggleComponent implements OnInit {
  @Input() section: IMenuNode;

  IMenuType = IMenuType;

  toggleSection(event: Event) {}

  ngOnInit(): void {}
}
