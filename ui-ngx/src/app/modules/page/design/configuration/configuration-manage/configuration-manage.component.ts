import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'hs-configuration-manage',
  templateUrl: './configuration-manage.component.html',
  styleUrls: ['./configuration-manage.component.less'],
  imports: [MatTabsModule],
})
export class ConfigurationManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
