import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'hs-configuration-editor',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class ConfigurationEditorComponent {}