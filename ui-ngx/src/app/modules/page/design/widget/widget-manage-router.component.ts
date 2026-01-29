import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
@Component({
  selector: 'hs-widget-manage-router',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
  providers: [WidgetEditorService],
})
export class WidgetManageRouterComponent {}
