import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hs-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  imports: [MatButtonModule, MatIconModule],
  host: {
    class: 'block h-40px',
  },
})
export class DashboardSettingsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
