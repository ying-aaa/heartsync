import { Component, OnInit } from '@angular/core';
import { WorkbenchHeaderComponent } from '../components/workbench-header/workbench-header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hs-lowcode',
  templateUrl: './lowcode.component.html',
  imports: [WorkbenchHeaderComponent, RouterModule],
})
export class LowcodeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
