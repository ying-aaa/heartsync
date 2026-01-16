import {
  Component,
  ComponentRef,
  effect,
  input,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponentFactoryService } from '@core/services/dynamic-component-factory.service';
import { DynamicWidgetComponent } from './dynamic-widget.component';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { FormlyRunModule } from '@app/modules/formly/formly-run.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FullscreenDirective } from '@src/app/shared/directive/fullscreen.directive';
import { ICodeWidgetConfig } from '@src/app/shared/models/code-widget.model';
import { ActivatedRoute } from '@angular/router';
import { CodeWidgetService } from '@src/app/core/http/code-widget.service';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { CommonModule } from '@angular/common';
import { IWidgetConfig } from '@src/app/shared/models/widget.model';
@Component({
  selector: 'hs-widget-code',
  templateUrl: './widget-code.component.html',
  imports: [HsLoadingModule, FullscreenDirective, MatIconModule, MatButtonModule],
})
export class WidgetCodeComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer: ViewContainerRef;

  widgetId = input<string>();
  fullscreen = false;

  widgetInfo = signal<ICodeWidgetConfig>({} as ICodeWidgetConfig);

  compRef: ComponentRef<any> | null = null;

  loadingStatus = false;

  constructor(
    private DynamicComponentFactoryService: DynamicComponentFactoryService,
    private scriptLoaderService: ScriptLoaderService,
    private codeWidgetService: CodeWidgetService,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      this.widgetId() && this.loadWidgetInfo();
    });
  }

  public loadResourceScript() {
    const { resourceScript } = this.widgetInfo();
    const resourceUrls = resourceScript.map((item: any) => item.resourceUrl);
    this.scriptLoaderService.loadScripts(resourceUrls).subscribe({
      next: (res) => {},
      error: (error) => {},
      complete: () => {
        this.loadingStatus = false;
        this.loadDynamicComponent();
      },
    });
  }

  public loadDynamicComponent() {
    this.destroyDynamicComponent();
    const { templateHtml, templateCss, templateJs } = this.widgetInfo();
    const func = new Function('DynamicWidgetComponent', templateJs);
    const imports: any = [
      FormsModule,
      ReactiveFormsModule,
      FormlyRunModule,
      FormlyModule,
      CommonModule,
    ];
    const preserveWhitespaces = true;

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

  loadWidgetInfo() {
    this.loadingStatus = true;
    this.codeWidgetService.getCodeWidgetById(this.widgetId() as string).subscribe((widgetInfo) => {
      this.widgetInfo.set(widgetInfo);
      this.loadResourceScript();
    });
  }

  setWidgetInfo(widgetInfo: ICodeWidgetConfig) {
    this.loadingStatus = true;
    this.widgetInfo.set(widgetInfo);
    this.loadResourceScript();
  }

  destroyDynamicComponent() {
    if (this.compRef) {
      this.compRef.destroy();
      this.compRef = null;
    }
  }

  ngOnInit() {}
}
