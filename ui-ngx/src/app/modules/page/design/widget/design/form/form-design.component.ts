import { Component, computed, OnInit, viewChild } from '@angular/core';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { WorkspaceContorlComponent } from './workspace-contorl/workspace-contorl.component';
import { MatDividerModule } from '@angular/material/divider';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
import { ActivatedRoute } from '@angular/router';
import { FormlyConfigEditorComponent } from '@src/app/modules/components/formly-config/formly-config-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormlyFormOptions } from '@ngx-formly/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { FormDesignToolbarComponent } from './form-design-toolbar/form-design-toolbar.component';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';

@Component({
  selector: 'hs-form-design',
  templateUrl: './form-design.component.html',
  styleUrls: ['./form-design.component.less'],
  imports: [
    WorkspaceContorlComponent,
    WorkspaceViewportComponent,
    MatDividerModule,
    FormlyConfigEditorComponent,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
    FormDesignToolbarComponent,
  ],
  providers: [FormEditorService],
})
export class FormDesignComponent implements OnInit {
  workspaceViewport = viewChild<WorkspaceViewportComponent>('WorkspaceViewport');
  formlyConfig = viewChild<FormlyConfigEditorComponent>('FormlyConfig');

  constructor(
    private route: ActivatedRoute,
    public formEditorService: FormEditorService,
    public widgetEditorService: WidgetEditorService,
  ) {}

  options: FormlyFormOptions = {
    formState: {
      fieldsId: 'workspace',
      mousePosition: { x: 0, y: 0 },
      dragStart: false,
      isEditMode: computed(() => this.formEditorService.isEditMode()),
      activeField: computed(() => this.formEditorService.activeField()),
      selectField: this.formEditorService.selectField.bind(this.formEditorService),
      getConnectedTo: this.formEditorService.getConnectedTo.bind(this.formEditorService),
      syncFormilyForm: this.syncFormilyForm.bind(this),
    },
  };

  syncFormilyForm() {
    this.workspaceViewport()?.syncFormilyForm();
    this.formlyConfig()?.syncFormilyForm();
  }

  initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    if (widgetId) {
      this.formEditorService.formWidgetId.set(widgetId);
      this.widgetEditorService.setWidgetId(widgetId);
      this.widgetEditorService.widgetType.set(IWidgetType.FORM);
    }
  }

  ngOnInit() {
    this.initRouteWidget();
  }
}
