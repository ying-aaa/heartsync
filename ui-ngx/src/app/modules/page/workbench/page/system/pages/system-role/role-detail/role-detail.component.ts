import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';

@Component({
  selector: 'hs-role-detail',
  templateUrl: './role-detail.component.html',
  imports: [MatTabsModule],
})
export class RoleDetailComponent implements OnInit {
  roleId: string | null = getParamFromRoute('roleId', this.route);

  constructor(private route: ActivatedRoute) {
    console.log('%c Line:15 🍺 route', 'color:#33a5ff', route);
  }

  ngOnInit() {}
}
