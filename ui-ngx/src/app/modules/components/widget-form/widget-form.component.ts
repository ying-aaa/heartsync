import { Component, effect, input, signal, OnInit } from '@angular/core';
import { FormlyRunModule } from '../../formly/formly-run.module';
import { IEditorFormlyField } from '@src/app/shared/models/public-api';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { FormWidgetService } from '@src/app/core/http/form-widget.service';
import { IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; // 新增：用于*ngIf等指令

@Component({
  selector: 'hs-widget-form',
  templateUrl: './widget-form.component.html',
  imports: [
    FormlyRunModule,
    MatProgressSpinnerModule,
    CommonModule, // 新增：补充模板指令依赖
  ],
  host: {
    class: 'relative block w-full min-h-[300px]', // 修正：w-100% → w-full，min-h-300px → min-h-[300px]（CSS规范）
  },
})
export class WidgetFormComponent implements OnInit {
  widgetId = input<string>();
  formWidgetConfig = input<IFormWidgetConfig>();

  formConfig = signal<IFormWidgetConfig | null>(null);
  loadingState = signal(true);
  errorState = signal<string | null>(null);

  model = signal<Record<string, any>>({});
  fields = signal<IEditorFormlyField[]>([]);

  formGroup = new FormGroup({});
  options: FormlyFormOptions = {
    formState: {},
  };

  constructor(private formWidgetService: FormWidgetService) {
    effect(() => {
      const currentId = this.widgetId();
      const currentConfig = this.formWidgetConfig();
      this.handleConfigSource(currentId, currentConfig);
    });
  }

  ngOnInit() {}

  /**
   * 处理配置来源（优先用外部传的配置，无则用id请求）
   * @param id 组件id
   * @param externalConfig 外部传入的配置
   */
  private handleConfigSource(
    id: string | undefined,
    externalConfig: IFormWidgetConfig | undefined,
  ): void {
    this.errorState.set(null);
    this.formConfig.set(null);

    if (!id && !externalConfig) {
      this.errorState.set('组件必须传入 widgetId 或 widgetConfig 其中一个');
      console.error(this.errorState());
      return;
    }

    if (externalConfig) {
      this.useExternalConfig(externalConfig, id);
      return;
    }

    this.fetchConfigById(id!);
  }

  /**
   * 使用外部传入的配置
   * @param config 外部配置
   * @param id 组件id（可选，用于提示）
   */
  private useExternalConfig(config: IFormWidgetConfig, id?: string): void {
    if (id) {
      console.warn(`组件同时传入了 widgetId(${id}) 和 widgetConfig，将优先使用 widgetConfig`);
    }

    if (!config.flatTypeField) {
      this.errorState.set('部件加载失败');
      console.error("外部传入的 widgetConfig 缺少 flatTypeField 字段，无法渲染表单");
      return;
    }

    this.formConfig.set(config);
    this.fields.set(config.flatTypeField as IEditorFormlyField[]);
    this.refreshFormlyForm();

    this.loadingState.set(false);
  }

  /**
   * 根据id请求配置
   * @param id 组件id
   */
  private fetchConfigById(id: string): void {
    this.loadingState.set(true);

    this.formWidgetService.getFormWidgetById(id).subscribe({
      next: (widgetConfig: IFormWidgetConfig) => {
        this.loadingState.set(false);

        if (!widgetConfig.flatTypeField) {
          this.errorState.set(`部件加载失败`);
          console.error(this.errorState());
          return;
        }

        this.formConfig.set(widgetConfig);
        this.fields.set(widgetConfig.flatTypeField as IEditorFormlyField[]);
        this.refreshFormlyForm(); // 触发Formly刷新
      },
      error: (err: any) => {
        this.loadingState.set(false);
        const errorMsg = `部件加载失败：${err.message || '未知错误'}`;
        this.errorState.set(errorMsg);
        console.error(errorMsg, err);
      },
    });
  }

  /**
   * 刷新Formly表单（避免渲染异常）
   */
  private refreshFormlyForm(): void {
    this.formGroup = new FormGroup({});
    if (this.options.build) {
      this.options.build();
    }
    this.model.set({});
  }
}
