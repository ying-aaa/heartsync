import { Component, OnInit } from '@angular/core';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { MenuDesignerComponent } from './menu-designer/menu-designer.component';

@Component({
  selector: 'hs-menu-management',
  template: `
    <!-- <hs-menu-tree></hs-menu-tree> -->
    <hs-menu-designer></hs-menu-designer>
  `,
  imports: [MenuTreeComponent, MenuDesignerComponent],
})
export class MenuManagementComponent implements OnInit {
  ngOnInit(): void {}
}
