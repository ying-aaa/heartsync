import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MenuManagementComponent } from "../menu-management/menu-management.component";

@Component({
  selector: 'hs-configuration-manage',
  templateUrl: './configuration-manage.component.html',
  styleUrls: ['./configuration-manage.component.less'],
  imports: [MatTabsModule, MenuManagementComponent],
})
export class ConfigurationManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
