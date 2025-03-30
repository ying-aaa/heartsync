import { Component, Inject, OnInit, Optional, viewChild } from '@angular/core';
import { WorkspaceToobarComponent } from './workspace-toobar/workspace-toobar.component';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigOption, FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormEditorService } from '../../../../../../../core/services/form-editor.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IEditSizeType } from '@src/app/shared/models/public-api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormlyEditorModule } from '@src/app/modules/formly/formly-editor.module';
import { WidgetZoomComponent } from '../../../widget-zoom.component';

@Component({
  selector: 'hs-workspace-viewport',
  templateUrl: './workspace-viewport.component.html',
  styleUrls: ['./workspace-viewport.component.less'],
  imports: [
    WorkspaceToobarComponent,
    MatDividerModule,
    FormlyEditorModule,
    NgScrollbarModule,
  ],
})
export class WorkspaceViewportComponent implements OnInit {
  ZoomControl = viewChild<WidgetZoomComponent | undefined>('ZoomControl');

  constructor(
    public formEditorService: FormEditorService,
    @Optional() @Inject(FORMLY_CONFIG) configs: ConfigOption[] = [],
  ) {}

  get getJsonField() {
    return this.formEditorService.getJsonField();
  }

  ngOnInit() {}
}
