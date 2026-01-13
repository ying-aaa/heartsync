import { Component, effect, input, OnInit, signal } from '@angular/core';
import { FormlyRunModule } from '../../formly/formly-run.module';
import { IEditorFormlyField } from '@src/app/shared/models/public-api';
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

  widgetConfig = signal<IFormWidgetConfig>({} as IFormWidgetConfig);

  loadingState = signal(false);

  model = {};
  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  options: FormlyFormOptions = {};

  constructor(private formWidgetService: FormWidgetService) {
    effect(() => {
      this.getWidgetConfig(this.widgetId());
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
        this.fields.set((widgetConfig.flatTypeField as IEditorFormlyField[]) || []);
        this.loadingState.set(false);
      },
      error: (err: any) => console.error('Get widget error:', err),
    });
  }
}
