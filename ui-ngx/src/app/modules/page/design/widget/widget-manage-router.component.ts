import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'hs-widget-manage-router',
  template: `
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule],
})
export class WidgetManageRouterComponent {

}
