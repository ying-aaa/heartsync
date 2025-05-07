import { WidgetType } from '../entities/widget.entity';

export interface WidgetStrategy {
  readonly type: WidgetType;

  createWidget(widgetId: string, config: Record<string, any>): Promise<any>;

  updateWidget(widgetId: string, config: Record<string, any>): Promise<any>;

  deleteWidget(widgetId: string): Promise<any>;
}
