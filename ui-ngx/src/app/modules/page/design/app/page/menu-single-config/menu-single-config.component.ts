import { ChangeDetectionStrategy, Component, computed, HostBinding, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';

@Component({
  selector: 'hs-menu-single-config',
  templateUrl: './menu-single-config.component.html',
  imports: [
    MatDivider,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIcon,
    FormlyConfigComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSingleConfigComponent implements OnInit {
  constructor() {}

  closeSignleConfig() {
  }

  ngOnInit() {}
}
