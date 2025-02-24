import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { WidgetEditorService } from './widget-editor.service';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
import { WorkspaceContorlComponent } from './workspace-contorl/workspace-contorl.component';
import { WorkspaceConfigComponent } from './workspace-config/workspace-config.component';
@Component({
  selector: 'hs-widget-editor',
  templateUrl: './widget-editor.component.html',
  styleUrls: ['./widget-editor.component.less'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule,
    WorkspaceViewportComponent,
    WorkspaceContorlComponent,
    WorkspaceConfigComponent,
  ],
})
export class WidgetEditorComponent implements OnInit {
  constructor(public widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}
}
