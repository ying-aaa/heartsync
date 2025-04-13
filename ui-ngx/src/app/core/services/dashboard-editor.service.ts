import { Injectable } from '@angular/core';
import { GridsterComponent } from 'angular-gridster2';

@Injectable({
  providedIn: 'root',
})
export class DashboardEditorService {
  gridsterInstall: GridsterComponent;

  constructor() {}

  setGridsterInstall(gridsterInstall: GridsterComponent) {
    this.gridsterInstall = gridsterInstall;
  }

  resizeGridster() {
    this.gridsterInstall?.onResize();
  }
}
