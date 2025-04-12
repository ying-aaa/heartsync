import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hs-dashboard-editor',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class DashboardEditorComponent {}
