import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WidgetFolderComponent } from './widget-folder/widget-folder.component';
import { PresetComponentsComponent } from '@src/app/modules/workbench/components/preset-components/preset-components.component';
import { WidgetOutlineComponent } from './widget-outline/widget-outline.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hs-workspace-contorl',
  templateUrl: './workspace-contorl.component.html',
  styleUrls: ['./workspace-contorl.component.less'],
  imports: [
    MatTabsModule,
    MatIconModule,
    WidgetFolderComponent,
    PresetComponentsComponent,
    WidgetOutlineComponent,
  ],
})
export class WorkspaceContorlComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
