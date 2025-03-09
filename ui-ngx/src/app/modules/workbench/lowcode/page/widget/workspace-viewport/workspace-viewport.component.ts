import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Inject,
  OnInit,
  Optional,
  Signal,
} from '@angular/core';
import { WorkspaceToobarComponent } from './workspace-toobar/workspace-toobar.component';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigOption, FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetEditorService } from '../widget-editor.service';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
import { HsCodeComponent } from '@src/app/shared/components/hs-code/hs-code.component';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'hs-workspace-viewport',
  templateUrl: './workspace-viewport.component.html',
  styleUrls: ['./workspace-viewport.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WorkspaceToobarComponent,
    MatDividerModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class WorkspaceViewportComponent implements OnInit {
  constructor(
    public widgetEditorService: WidgetEditorService,
    @Optional() @Inject(FORMLY_CONFIG) configs: ConfigOption[] = [],
  ) {}

  get getJsonField() {
    return this.widgetEditorService.getJsonField();
  }

  ngOnInit() {}
}
