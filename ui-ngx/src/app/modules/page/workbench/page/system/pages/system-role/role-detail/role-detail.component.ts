import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'hs-role-detail',
  templateUrl: './role-detail.component.html',
  imports: [MatTabsModule],
})
export class RoleDetailComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
