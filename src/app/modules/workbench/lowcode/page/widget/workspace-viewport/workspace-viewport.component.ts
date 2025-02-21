import { Component, Input, OnInit } from '@angular/core';
import { WorkspaceToobarComponent } from './workspace-toobar/workspace-toobar.component';
import { WorkspaceContentComponent } from './workspace-content/workspace-content.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormlyModule } from '@ngx-formly/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'hs-workspace-viewport',
  templateUrl: './workspace-viewport.component.html',
  styleUrls: ['./workspace-viewport.component.less'],
  imports: [
    WorkspaceToobarComponent,
    MatDividerModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class WorkspaceViewportComponent implements OnInit {
  @Input() fields: Array<IEditorFormlyField> = [];
  formGroup = new FormGroup({});
  model = {};
  options = {};

  constructor() {}

  ngOnInit() {}
}
