import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'hs-widget-design-router',
  template: `
    <content class="block wh-full">
      <router-outlet></router-outlet>
    </content>
  `,
  imports: [RouterModule, MatDividerModule],
})
export class WidgetDesignRouterComponent {}
