import { Component, Inject, OnInit, Optional, viewChild } from '@angular/core';
import { WorkspaceToobarComponent } from './workspace-toobar/workspace-toobar.component';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigOption, FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormEditorService } from '../form-editor.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IEditSizeType } from '@src/app/shared/models/public-api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceZoomComponent } from './workspace-zoom/workspace-zoom.component';
import { CdkDrag } from '@angular/cdk/drag-drop';

const viewportConfig = {
  [IEditSizeType.FILL]: {
    width: '100%',
    height: '100%',
  },
  [IEditSizeType.MOBILE]: {
    width: '375px',
    height: '667px',
  },
  [IEditSizeType.IPAD]: {
    width: '1024px',
    height: '768px',
  },
  [IEditSizeType.PC]: {
    width: '1980px',
    height: '1020px',
  },
  [IEditSizeType.CUSTOM]: {
    width: '800px',
    height: '600px',
  },
};

@Component({
  selector: 'hs-workspace-viewport',
  templateUrl: './workspace-viewport.component.html',
  styleUrls: ['./workspace-viewport.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkDrag,
    WorkspaceToobarComponent,
    MatDividerModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    MatButtonModule,
    MatIconModule,
    WorkspaceZoomComponent,
  ],
})
export class WorkspaceViewportComponent implements OnInit {
  viewportConfig = viewportConfig;
  ZoomControl = viewChild<WorkspaceZoomComponent | undefined>('ZoomControl');

  constructor(
    public formEditorService: FormEditorService,
    @Optional() @Inject(FORMLY_CONFIG) configs: ConfigOption[] = [],
  ) {}

  get getJsonField() {
    return this.formEditorService.getJsonField();
  }

  ngOnInit() {}
}
