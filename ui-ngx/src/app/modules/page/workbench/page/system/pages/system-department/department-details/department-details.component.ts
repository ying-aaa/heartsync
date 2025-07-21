import { Component, input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GroupsChildrenComponent } from './groups-children/groups-children.component';
import { IAnyPropObj } from '@src/app/shared/models/system.model';
import { GroupsMembersComponent } from './groups-members/groups-members.component';
import { GroupsAttributesComponent } from './groups-attributes/groups-attributes.component';
import { GroupsRolesComponent } from './groups-roles/groups-roles.component';

@Component({
  selector: 'hs-department-details',
  templateUrl: './department-details.component.html',
  imports: [
    MatTabsModule,
    GroupsChildrenComponent,
    GroupsMembersComponent,
    GroupsAttributesComponent,
    GroupsRolesComponent,
  ],
})
export class DepartmentDetailsComponent implements OnInit {
  activeGroup = input<IAnyPropObj | null>();

  constructor() {}

  ngOnInit() {}
}
