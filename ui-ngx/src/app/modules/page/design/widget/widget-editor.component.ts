import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormEditorService } from '../../../../core/services/form-editor.service';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
import { WorkspaceContorlComponent } from './workspace-contorl/workspace-contorl.component';
import { WorkspaceConfigComponent } from './workspace-config/workspace-config.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'hs-widget-editor',
  template: ` <router-outlet></router-outlet> `,
  imports: [
    // WorkspaceViewportComponent,
    // WorkspaceConfigComponent,
    // WorkspaceContorlComponent,
    // WidgetFolderComponent,
    // MatIconModule,
    // MatButtonModule,
    // MatDividerModule,
    RouterModule,
  ],
})
export class WidgetEditorComponent {
  // constructor(public formEditorService: FormEditorService) {}
  // ngOnInit() {}
  // hideFieldConfig() {
  //   this.formEditorService.isShowConfigPanel.set(false);
  //   this.formEditorService.selectField(null);
  // }
}
