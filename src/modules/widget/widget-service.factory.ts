import { BadRequestException, Injectable } from '@nestjs/common';
import { WidgetStrategy } from './model/widget-strategy.interface';
import { HsFormWidgetsService } from './types/form-widget/form-widget.service';
import { HsCodeWidgetsService } from './types/code-wieget/code-widget.service';
import { IWidgetType } from '@heartsync/types';

@Injectable()
export class HsWidgetServiceFactory {
  constructor(
    private formWidgetsService: HsFormWidgetsService,
    private codeWidgetsService: HsCodeWidgetsService,
  ) {}

  getService(type: IWidgetType): WidgetStrategy {
    switch (type) {
      case IWidgetType.FORM:
        return this.formWidgetsService;
      case IWidgetType.CODE:
        return this.codeWidgetsService;
      default:
        throw new BadRequestException('小部件类型无效');
    }
  }
}
