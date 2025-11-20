import { Component, OnInit } from '@angular/core';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { WorkspaceContorlComponent } from './workspace-contorl/workspace-contorl.component';
import { MatDividerModule } from '@angular/material/divider';
import { WorkspaceViewportComponent } from './workspace-viewport/workspace-viewport.component';
import { ActivatedRoute } from '@angular/router';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'hs-form-design',
  templateUrl: './form-design.component.html',
  styleUrls: ['./form-design.component.less'],
  imports: [
    WorkspaceContorlComponent,
    WorkspaceViewportComponent,
    MatDividerModule,
    FormlyConfigComponent,
    MatIconModule,
    MatButtonModule,
    NgScrollbarModule,
  ],
})
export class FormDesignComponent implements OnInit {
  constructor(
    public formEditorService: FormEditorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initRouteWidget();
  }

  initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    widgetId && this.formEditorService.fieldsId.set(widgetId);
  }
}
