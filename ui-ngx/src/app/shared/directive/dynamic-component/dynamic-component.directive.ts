// dynamic-component.directive.ts
import { Directive, ViewContainerRef, Input, OnInit, OnDestroy, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { DynamicWidgetComponent } from '@src/app/modules/components/widget-code/dynamic-widget.component';
import { componentConfig, ComponentEvent } from './dynamic-component.model';

@Directive({
  selector: '[dynamicComponent]',
})
export class DynamicComponentDirective implements OnInit, OnDestroy {
  @Input() config!: componentConfig;
  private componentRef: any;
  private subscriptions = new Subscription();

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    const show =
      typeof this.config.showCondition === 'function'
        ? this.config.showCondition()
        : (this.config.showCondition ?? true);

    if (!show) return;

    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(this.config.component);

    Object.keys(this.config.props).forEach((key) => {
      this.componentRef.instance[key] = this.config.props[key];
    });

    this.config.events?.forEach((event: ComponentEvent) => {
      if (this.componentRef.instance[event.name]?.subscribe) {
        this.subscriptions.add(this.componentRef.instance[event.name].subscribe(event.handler));
      } else {
        this.componentRef.instance[event.name] = event.handler;
      }
    });

    this.config.styles &&
      Object.keys(this.config.styles).forEach((key) => {
        this.componentRef.location.nativeElement.style[key] = this.config.styles[key];
      });

    this.componentRef.instance.ngOnInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
