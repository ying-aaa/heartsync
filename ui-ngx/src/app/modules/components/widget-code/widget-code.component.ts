import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentFactoryService } from '@core/services/dynamic-component-factory.service';
import { DynamicWidgetComponent } from './dynamic-widget.component';
@Component({
  selector: 'hs-widget-code',
  templateUrl: './widget-code.component.html',
})
export class WidgetCodeComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  @Input() widgetId: any;

  @Input() widgetInfo: any;

  compRef: ComponentRef<any> | null = null;

  constructor(
    private DynamicComponentFactoryService: DynamicComponentFactoryService,
  ) {}

  public loadDynamicComponent() {
    this.destroyDynamicComponent();
    
    const {templateHtml, templateCss, templateJs} = this.widgetInfo;
    const func = new Function("DynamicWidgetComponent", templateJs);
    const imports: any = [];
    const preserveWhitespaces = false;

    this.DynamicComponentFactoryService
      .createDynamicComponent(func(DynamicWidgetComponent), templateHtml, imports, preserveWhitespaces, [templateCss])
      .subscribe((component) => {
        this.compRef = this.dynamicComponentContainer.createComponent(component);
      });
  }

  destroyDynamicComponent() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
  }

  ngOnInit() {
    this.loadDynamicComponent();
  }
}
