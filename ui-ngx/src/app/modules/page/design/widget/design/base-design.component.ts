import { Directive, OnDestroy } from '@angular/core'; // 导入Directive装饰器
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { IWidgetTypeAbstract } from '@src/app/shared/models/widget.model';

@Directive()
export abstract class BaseDesignComponent implements OnDestroy {
  constructor(
    protected widgetTypeService: IWidgetTypeAbstract,
    protected widgetEditorService: WidgetEditorService,
  ) {
    this.widgetEditorService.setWidgetTypeService(widgetTypeService);
  }
  ngOnDestroy(): void {
    this.widgetEditorService.setWidgetTypeService(null);
  }
}
