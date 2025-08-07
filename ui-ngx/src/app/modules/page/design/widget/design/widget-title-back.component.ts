import { Component, computed, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PresetComponentsComponent } from '../../../common/preset-components/preset-components.component';
import { WidgetOutlineComponent } from './form/workspace-contorl/widget-outline/widget-outline.component';
import {
  flatWidgetTypesList,
  WidgetEditorService,
} from '@src/app/core/services/widget-editor.service';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { Router } from '@angular/router';
import { matchSubstring } from '@src/app/core/utils';

@Component({
  selector: 'hs-widget-title-back',
  templateUrl: './widget-title-back.component.html',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class WidgetTitleBackComponent implements OnInit {
  constructor(
    public widgetEditorService: WidgetEditorService,
    public formEditorService: FormEditorService,
    private router: Router,
  ) {}

  activeWidgetTypeName = computed(() =>
    flatWidgetTypesList.get(this.widgetEditorService.currentWidgetType()),
  );

  activeWidgetName = computed(() => {
    return this.widgetEditorService.currentWidgetConfig().name;
  });

  toWidgetManage() {
    const currentUrl = this.router.url;
    const toUrl = matchSubstring(currentUrl, '/design', '/widget');
    this.router.navigate([toUrl]);
  }

  ngOnInit() {}
}
