import { Component, input, signal, effect, OnInit, computed } from '@angular/core';
import { WidgetService } from '@src/app/core/http/widget.service';
import { IWidgetConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { WidgetComponent } from '../widget/widget.component';
import { FullscreenDirective } from '@src/app/shared/directive/fullscreen.directive';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner'; // 新增：用于*ngIf等指令

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
  widgetConfig = input<IWidgetConfig>();

  loadingState = signal(false);
  errorState = signal<string | null>(null);

  widgetContext = signal<IWidgetConfig>({
    id: '',
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
  });

  widgetSettings = computed(() => this.widgetContext().settings);

  fullscreen = false;

  constructor(private widgetHttpService: WidgetService) {
    effect(() => {
      const currentId = this.widgetId();
      const currentConfig = this.widgetConfig();
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

    if (!id && !externalConfig) {
      this.errorState.set('部件容器未找到');
      console.error(this.errorState());
      return;
    }

    if (externalConfig) {
      this.useExternalConfig(externalConfig);
      return;
    }

    this.fetchConfigById(id!);
  }

  private useExternalConfig(config: IWidgetConfig): void {
    if (this.widgetId()) {
      console.warn(
        `容器同时传入了 widgetId(${this.widgetId()}) 和 widgetConfig，将优先使用 widgetConfig`,
      );
    }
    this.updateWidgetContext(config);
  }

  private fetchConfigById(id: string): void {
    this.loadingState.set(true);

    this.widgetHttpService.getWidgetById(id).subscribe({
      next: (widgetConfig: IWidgetConfig) => {
        this.loadingState.set(false);
        this.updateWidgetContext(widgetConfig);
      },
      error: (err: any) => {
        this.loadingState.set(false);
        const errorMsg = `${err.message || '未知错误'}`;
        this.errorState.set(errorMsg);
        console.error(errorMsg, err);
      },
    });
  }

  private updateWidgetContext(config: IWidgetConfig): void {
    this.widgetContext.update((prev) => ({
      ...prev,
      ...config,
    }));
  }
}
