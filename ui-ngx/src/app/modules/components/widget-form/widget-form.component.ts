import {
  Component,
  effect,
  input,
  OnInit,
  Renderer2,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { FormlyRunModule } from '../../formly/formly-run.module';
import {
  IEditorFormlyField,
  IWidgetSizeStyle,
} from '@src/app/shared/models/public-api';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { FormWidgetService } from '@src/app/core/http/form-widget.service';
import { IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'hs-widget-form',
  templateUrl: './widget-form.component.html',
  imports: [FormlyRunModule, MatProgressSpinnerModule],
  host: {
    class: 'relative block w-100% min-h-300px',
  },
})
export class WidgetFormComponent implements OnInit {
  widgetId = input.required<string>();
  sizeStyle = input<IWidgetSizeStyle | undefined>();

  widgetConfig = signal<IFormWidgetConfig>({} as IFormWidgetConfig);

  loadingState = signal(false);

  model = {};
  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  options: FormlyFormOptions = {};

  constructor(
    private formWidgetService: FormWidgetService,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      this.getWidgetConfig(this.widgetId());
    });
    effect(() => {
      this.setOutermostLayerFieldSize();
    });
  }

  ngOnInit() {}

  getWidgetConfig(widgetId: string | undefined) {
    widgetId = widgetId || this.widgetId();
    if (!widgetId) return;
    this.loadingState.set(true);
    // 获取 widget 配置
    this.formWidgetService.getFormWidgetById(widgetId as string).subscribe({
      next: (widgetConfig: IFormWidgetConfig) => {
        this.widgetConfig.set(widgetConfig);
        this.fields.set(widgetConfig.flatTypeField as IEditorFormlyField[] || []);
        this.loadingState.set(false);
        setTimeout(() => {
          this.setOutermostLayerFieldSize();
        }, 100);
      },
      error: (err: any) => console.error('Get widget error:', err),
    });
  }

  setOutermostLayerFieldSize() {
    if (this.fields().length) return;
    const hostElement = this.viewContainerRef.element.nativeElement;
    const targetElement = hostElement.querySelector('.outermost-layer-field');
    if (!hostElement || !targetElement) return;
    const { width, height } = this.sizeStyle() as IWidgetSizeStyle;
    this.renderer.setStyle(targetElement, 'width', width);
    this.renderer.setStyle(targetElement, 'height', height);
  }
}
