import { ChangeDetectionStrategy, Component, computed, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MenuDesignerService } from '../../menu-deisgner.sevice';
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
  constructor(private menuDesignerService: MenuDesignerService) {}

  selectedNode = this.menuDesignerService.selectedNode;
  showSignleConfig = computed(() => this.menuDesignerService.showSignleConfig());

  // 是否显示当前组件
  @HostBinding('style.display')
  get show(): string {
    return this.showSignleConfig() ? 'block' : 'none';
  }

  closeSignleConfig() {
    this.menuDesignerService.toggleShowSignleConfig(false);
  }

  ngOnInit() {}
}
