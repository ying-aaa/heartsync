import { Component, input, OnInit } from '@angular/core';
import { WidgetService } from '@src/app/core/http/widget.service';
import { IWidgetType } from '@src/app/shared/models/public-api';
import { WidgetComponent } from '../widget/widget.component';
import { FullscreenDirective } from '@src/app/shared/directive/fullscreen.directive';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'hs-widget-container',
  templateUrl: './widget-container.component.html',
  imports: [WidgetComponent, FullscreenDirective, MatIconButton, MatIcon],
})
export class WidgetContainerComponent implements OnInit {
  widgetId = input.required<string>();

  widgetType = input<IWidgetType>();

  widgetContext = {
    widgetId: '',
    widgetType: "",
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
      lineHeight: "32px",
      padding: "0px"
    },
    iconStyle: {},
    widgetStyle: {},
  };

  fullscreen = false;

  constructor(private WidgetHttpService: WidgetService) {}

  ngOnInit() {}
}
