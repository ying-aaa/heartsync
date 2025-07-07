import { Component, effect, OnInit, signal } from '@angular/core';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { SplitComponent, SplitAreaComponent } from 'angular-split';
import { IAnyPropObj } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-system-department',
  templateUrl: './system-department.component.html',
  imports: [
    DepartmentDetailsComponent,
    DepartmentListComponent,
    SplitAreaComponent,
    SplitComponent,
  ],
})
export class SystemOrganizationComponent implements OnInit {
  activeGroup = signal<IAnyPropObj | null>(null);

  constructor() {
    effect(() => {
      console.log('%c Line:23 🥑', 'color:#ffdd4d', this.activeGroup());
    });
  }

  ngOnInit() {}
}
