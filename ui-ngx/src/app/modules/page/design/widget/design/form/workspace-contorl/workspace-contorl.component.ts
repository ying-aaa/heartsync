import { Component, computed, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PresetComponentsComponent } from '@src/app/modules/page/common/preset-components/preset-components.component';
import { WidgetOutlineComponent } from './widget-outline/widget-outline.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  flatWidgetTypesList,
  WidgetEditorService,
} from '@app/core/services/widget-editor.service';
import { MatButtonModule } from '@angular/material/button';
import { FormEditorService } from '@app/core/services/form-editor.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'hs-workspace-contorl',
  templateUrl: './workspace-contorl.component.html',
  styleUrls: ['./workspace-contorl.component.less'],
  imports: [
    MatTabsModule,
    MatIconModule,
    PresetComponentsComponent,
    WidgetOutlineComponent,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class WorkspaceContorlComponent implements OnInit {
  constructor(
    public widgetEditorService: WidgetEditorService,
    public formEditorService: FormEditorService,
    private router: Router,
  ) {}

  ngOnInit() {}

  activeModeName = computed(() =>
    flatWidgetTypesList.get(this.widgetEditorService.activeMode()),
  );

  activeWidgetName = computed(() => {
    return this.widgetEditorService.currentWidgetConfig().workspaceName;
  });

  toWidgetManage() {
    this.router.navigate(['/design/widget/resource']);
  }
}
