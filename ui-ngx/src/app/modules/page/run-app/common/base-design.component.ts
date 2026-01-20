// src/app/shared/base-design.component.ts
import { HostBinding, HostListener, Directive } from '@angular/core'; // 导入Directive装饰器
import { computed } from '@angular/core';
import { RunAppDesignService } from '@core/services/run-app-designer.service';

@Directive()
export abstract class BaseDesignComponent {
  constructor(protected runAppDesignService: RunAppDesignService) {}

  protected abstract configTypeKey: string;

  isDesigner = computed(() => this.runAppDesignService.isDesigner());
  selectedConfigType = computed(() => this.runAppDesignService.selectedConfigType());

  @HostBinding('class.design')
  get _isDesigner() {
    return this.isDesigner();
  }

  @HostBinding('class.active')
  get _isActive() {
    return this.isDesigner() && this.selectedConfigType()?.value === this.configTypeKey;
  }

  @HostListener('click')
  click() {
    this.runAppDesignService.setConfigType(this.configTypeKey);
  }
}
