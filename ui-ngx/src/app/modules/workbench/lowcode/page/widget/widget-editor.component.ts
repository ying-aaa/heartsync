import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatNativeDateModule } from '@angular/material/core';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import * as monaco from 'monaco-editor';
import {
  MonacoEditorModule,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { HighlightAuto, HighlightModule } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'hs-widget-editor',
  templateUrl: './widget-editor.component.html',
  styleUrls: ['./widget-editor.component.less'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatDividerModule,
    WorkspaceViewportComponent,
    WorkspaceContorlComponent,
    WorkspaceConfigComponent,
    // MatFormFieldControl,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormlyMaterialModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    FormlyMatToggleModule,
    FormlyMatSliderModule,
    FormlyModule,
    FormsModule,
    // MonacoEditorModule,
  ],
})
export class WidgetEditorComponent implements OnInit {
  constructor(public widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}
}
