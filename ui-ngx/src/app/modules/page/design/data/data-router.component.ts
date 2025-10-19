import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hs-Data-router',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class DataRouterComponent {
  constructor() {}
}
