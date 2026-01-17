import { Component, OnInit } from '@angular/core';
import { WorkspaceContorlComponent } from '../form/workspace-contorl/workspace-contorl.component';
import { MatDivider } from '@angular/material/divider';
import { FormlyConfigEditorComponent } from '@src/app/modules/components/formly-config/formly-config-editor.component';
import { ActivatedRoute } from '@angular/router';
import { FormEditorService } from '@src/app/core/services/form-editor.service';

@Component({
  selector: 'hs-list-design',
  templateUrl: './list-design.component.html',
  styleUrls: ['./list-design.component.less'],
  imports: [
    WorkspaceContorlComponent,
    MatDivider,
    FormlyConfigEditorComponent,
  ],
})
export class ListDesignComponent implements OnInit {
  constructor(
    public formEditorService: FormEditorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initRouteWidget();
  }

  initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    widgetId && this.formEditorService.formWidgetId.set(widgetId);
  }
}
