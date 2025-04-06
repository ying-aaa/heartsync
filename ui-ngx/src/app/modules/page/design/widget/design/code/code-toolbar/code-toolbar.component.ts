import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';

@Component({
  selector: 'hs-code-toolbar',
  templateUrl: './code-toolbar.component.html',
  styleUrls: ['./code-toolbar.component.less'],
  imports: [MatIconModule, MatButtonModule],
})
export class CodeToolbarComponent implements OnInit {
  constructor(
    public widgetEditorService: WidgetEditorService,
    private router: Router,
  ) {}

  toWidgetManage() {
    this.router.navigate(['/design/widget/resource']);
  }

  ngOnInit() {}
}
