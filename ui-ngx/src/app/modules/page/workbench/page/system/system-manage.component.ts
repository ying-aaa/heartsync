import { Component, OnInit } from '@angular/core';
import { SystemOptionComponent } from './common/system-option/system-option.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hs-system-manage',
  templateUrl: './system-manage.component.html',
  imports: [SystemOptionComponent, RouterModule, MatDividerModule],
})
export class SystemManageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
