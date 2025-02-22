import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'hs-workspace-toobar',
  templateUrl: './workspace-toobar.component.html',
  styleUrls: ['./workspace-toobar.component.css'],
  imports: [MatButtonModule, MatIconModule],
})
export class WorkspaceToobarComponent implements OnInit {
  constructor(public widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}
}
