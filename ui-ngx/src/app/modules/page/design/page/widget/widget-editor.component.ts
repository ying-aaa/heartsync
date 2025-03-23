import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormEditorService } from './form-editor.service';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
import { WorkspaceContorlComponent } from './workspace-contorl/workspace-contorl.component';
import { WorkspaceConfigComponent } from './workspace-config/workspace-config.component';
import { WidgetFolderComponent } from './widget-folder/widget-folder.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'hs-widget-editor',
  templateUrl: './widget-editor.component.html',
  styleUrls: ['./widget-editor.component.less'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    WorkspaceViewportComponent,
    WorkspaceConfigComponent,
    WorkspaceContorlComponent,
    WidgetFolderComponent,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
})
export class WidgetEditorComponent implements OnInit {
  constructor(public formEditorService: FormEditorService) {}

  ngOnInit() {}

  hideFieldConfig() {
    this.formEditorService.isShowConfigPanel.set(false);
    this.formEditorService.selectField(null);
  }
}
