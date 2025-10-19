import { Component, computed, OnInit } from '@angular/core';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { MenuDesignerComponent } from './menu-designer/menu-designer.component';
import { MenuDesignerService } from './menu-deisgner.sevice';

@Component({
  selector: 'hs-menu-management',
  template: `
    @if (showMode() === 'tree') {
      <hs-menu-tree></hs-menu-tree>
    } @else {
      <hs-menu-designer></hs-menu-designer>
    }
  `,
  imports: [MenuTreeComponent, MenuDesignerComponent],
})
export class MenuManagementComponent implements OnInit {
  constructor(private menuDesignerService: MenuDesignerService) {}

  showMode = computed(() => this.menuDesignerService.showMode());

  ngOnInit(): void {}
}
