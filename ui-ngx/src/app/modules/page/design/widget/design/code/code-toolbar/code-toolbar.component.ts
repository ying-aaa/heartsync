import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';

@Component({
  selector: 'hs-code-toolbar',
  templateUrl: './code-toolbar.component.html',
  styleUrls: ['./code-toolbar.component.less'],
  imports: [MatIconModule, MatButtonModule],
})
export class CodeToolbarComponent implements OnInit {
  @Input() loadCustomComponent = () => {};
  @Input() saveWidgetInfo = () => {};

  constructor(
    public widgetEditorService: WidgetEditorService,
    private router: Router,
    private scriptLoaderService: ScriptLoaderService,
  ) {}

  get scriptLoadingStatus() {
    return this.scriptLoaderService.getLoadingStatus();
  }

  toWidgetManage() {
    this.router.navigate(['/design/widget/resource']);
  }

  ngOnInit() {}
}
