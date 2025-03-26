import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetFolderComponent } from './widget-folder.component';
import { WidgetPreviewComponent } from './widget-preview.component';

@Component({
  selector: 'hs-widget-manage',
  templateUrl: './widget-manage.component.html',
  styleUrls: ['./widget-manage.component.less'],
  imports: [WidgetFolderComponent, MatDividerModule, WidgetPreviewComponent],
})
export class WidgetManageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
