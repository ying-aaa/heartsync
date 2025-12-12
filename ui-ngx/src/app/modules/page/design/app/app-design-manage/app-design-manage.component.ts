import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AppPageDesignerComponent } from '../page/app-page-designer.component';

@Component({
  selector: 'hs-app-design-manage',
  templateUrl: './app-design-manage.component.html',
  styleUrls: ['./app-design-manage.component.less'],
  imports: [MatTabsModule, AppPageDesignerComponent],
})
export class AppDesignManageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
