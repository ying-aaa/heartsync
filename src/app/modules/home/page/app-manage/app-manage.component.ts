import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HsTreeComponent } from "../../../../shared/components/hs-tree/hs-tree.component";

@Component({
  selector: 'app-app-manage',
  templateUrl: './app-manage.component.html',
  imports: [MatDividerModule, HsTreeComponent]
})
export class AppManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
