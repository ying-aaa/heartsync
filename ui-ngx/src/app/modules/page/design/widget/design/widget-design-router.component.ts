import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WidgetDesignToolbarComponent } from './toolbar/widget-design-toolbar.component';
import { MatDividerModule } from "@angular/material/divider";
@Component({
  selector: 'hs-widget-design-router',
  template: `
    <content class="block wh-full flex flex-col">
      <hs-widget-design-toolbar></hs-widget-design-toolbar>
      <mat-divider></mat-divider>
      <main class="h-0 flex-1">
        <router-outlet></router-outlet>
      </main>
    </content>
  `,
  imports: [RouterModule, WidgetDesignToolbarComponent, MatDividerModule],
})
export class WidgetDesignRouterComponent {}
