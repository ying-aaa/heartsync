import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'hs-widget-editor',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class WidgetEditorComponent {}
