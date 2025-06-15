import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';

@Component({
  selector: 'hs-menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.less'],
  imports: [MatIconModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent implements OnInit {
  @Input() section: IMenuNode;

  constructor() {}

  ngOnInit() {}
}
