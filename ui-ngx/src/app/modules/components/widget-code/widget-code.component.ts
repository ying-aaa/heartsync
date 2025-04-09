import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponentFactoryService } from '@core/services/dynamic-component-factory.service';
import { DynamicWidgetComponent } from './dynamic-widget.component';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { LoadingDirective } from '@src/app/shared/directive/loading.directive';
@Component({
  selector: 'hs-widget-code',
  templateUrl: './widget-code.component.html',
  imports: [LoadingDirective],
})
export class WidgetCodeComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer: ViewContainerRef;

  @Input() widgetId: any;

  @Input() widgetInfo: any;

  compRef: ComponentRef<any> | null = null;

  constructor(
    private DynamicComponentFactoryService: DynamicComponentFactoryService,
    private scriptLoaderService: ScriptLoaderService,
  ) {}

  get scriptLoadingStatus() {
    return this.scriptLoaderService.getLoadingStatus();
  }

  public loadDynamicComponent() {
    this.destroyDynamicComponent();

    const { templateHtml, templateCss, templateJs } = this.widgetInfo;
    const func = new Function('DynamicWidgetComponent', templateJs);
    const imports: any = [];
    const preserveWhitespaces = false;

    this.DynamicComponentFactoryService.createDynamicComponent(
      func(DynamicWidgetComponent),
      templateHtml,
      imports,
      preserveWhitespaces,
      [templateCss],
    ).subscribe((component) => {
      this.compRef = this.dynamicComponentContainer.createComponent(component);
    });
  }

  public loadResourceScript() {
    const { resourceScript } = this.widgetInfo;
    const resourceUrls = resourceScript.map((item: any) => item.resourceUrl);
    this.scriptLoaderService.loadScripts(resourceUrls).subscribe((res) => {
      this.loadDynamicComponent();
    });
  }

  destroyDynamicComponent() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
  }

  ngOnInit() {
    this.loadResourceScript();
  }
}
