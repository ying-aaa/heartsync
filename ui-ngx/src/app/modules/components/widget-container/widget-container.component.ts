import { Component, input, signal, effect, OnInit, computed } from '@angular/core';
import { WidgetService } from '@src/app/core/http/widget.service';
import { IWidgetConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { WidgetComponent } from '../widget/widget.component';
import { FullscreenDirective } from '@src/app/shared/directive/fullscreen.directive';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner'; // 新增：用于*ngIf等指令
import { IWidgetTypesConfig } from '@heartsync/types';

@Component({
  selector: 'hs-widget-container',
  templateUrl: './widget-container.component.html',
  imports: [
    WidgetComponent,
    FullscreenDirective,
    MatIconButton,
    MatIcon,
    CommonModule,
    MatProgressSpinner,
  ],
})
export class WidgetContainerComponent implements OnInit {
  widgetId = input<string>();
  widgetType = input<IWidgetType>();
  widgetConfigInput = input<IWidgetTypesConfig>();

  loadingState = signal(false);
  errorState = signal<string | null>(null);

  widgetConfig = signal<IWidgetTypesConfig>({
    id: '',
    name: '',
    appId: '',
    type: IWidgetType.FORM,
    settings: {
      anableFullscreen: true,
      showTitle: true,
      showTitleIcon: false,
      title: '你好世界',
      titleTooltip: '',
      icon: '',
      containerStyle: {
        backgroundColor: 'var(--base-bg-color)',
        color: 'rgba(0, 0, 0, .87)',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 5px, rgba(16, 16, 16, 0.35) 0px 0px 20px -10px',
      },
      titleStyle: {
        lineHeight: '32px',
        padding: '0px',
      },
      iconStyle: {},
      widgetStyle: {},
    },
  } as IWidgetTypesConfig);

  widgetSettings = computed(() => this.widgetConfig().settings);

  fullscreen = false;

  constructor(private widgetHttpService: WidgetService) {
    effect(() => {
      const currentId = this.widgetId();
      const currentConfig = this.widgetConfigInput();
      this.handleConfigSource(currentId, currentConfig);
    });
  }

  ngOnInit() {}

  private handleConfigSource(
    id: string | undefined,
    externalConfig: IWidgetConfig | undefined,
  ): void {
    this.loadingState.set(false);
    this.errorState.set(null);
    const type = this.widgetType();

    if (!id && !externalConfig && !type) {
      this.errorState.set('部件容器未找到');
      console.error(this.errorState());
      return;
    }

    if (externalConfig) {
      this.useExternalConfig(externalConfig);
      return;
    }
    this.fetchConfigById(id!, type!);
  }

  private useExternalConfig(config: IWidgetConfig): void {
    if (this.widgetId()) {
      console.warn(
        `容器同时传入了 widgetId(${this.widgetId()}) 和 widgetConfig，将优先使用 widgetConfigInput`,
      );
    }
    this.updatewidgetConfig(config);
  }

  private fetchConfigById(id: string, type: IWidgetType): void {
    this.loadingState.set(true);

    this.widgetHttpService.getWidgetById(id, type).subscribe({
      next: (widgetConfigInput: IWidgetConfig) => {
        this.loadingState.set(false);
        this.updatewidgetConfig(widgetConfigInput);
      },
      error: (err: any) => {
        this.loadingState.set(false);
        const errorMsg = `${err.message || '未知错误'}`;
        this.errorState.set(errorMsg);
        console.error(errorMsg, err);
      },
    });
  }

  private updatewidgetConfig(config: IWidgetConfig): void {
    this.widgetConfig.update((prev) => ({
      ...prev,
      ...config,
    }));
  }
}
