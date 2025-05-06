import { Injectable } from '@nestjs/common';
import { WidgetType } from './entities/widget.entity';
import { WidgetStrategy } from './model/widget-strategy.interface';
import { HsFormWidgetsService } from './types/form-widget/form-widget.service';

@Injectable()
export class HsWidgetServiceFactory {
  constructor(private formWidgetsService: HsFormWidgetsService) {}

  getService(type: string): WidgetStrategy {
    switch (type) {
      case WidgetType.FORM:
        return this.formWidgetsService;
      default:
        throw new Error('Invalid widget type');
    }
  }
}
