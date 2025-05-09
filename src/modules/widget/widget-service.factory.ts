import { Injectable } from '@nestjs/common';
import { WidgetType } from '../../database/entities/hs-widget.entity';
import { WidgetStrategy } from './model/widget-strategy.interface';
import { HsFormWidgetsService } from './types/form-widget/form-widget.service';
import { HsCodeWidgetsService } from './types/code-wieget/code-widget.service';

@Injectable()
export class HsWidgetServiceFactory {
  constructor(
    private formWidgetsService: HsFormWidgetsService,
    private codeWidgetsService: HsCodeWidgetsService,
  ) {}

  getService(type: string): WidgetStrategy {
    switch (type) {
      case WidgetType.FORM:
        return this.formWidgetsService;
      case WidgetType.CODE:
        return this.codeWidgetsService;
      default:
        throw new Error('小部件类型无效');
    }
  }
}
