import { IWidgetType } from '@heartsync/types';
import { EntityManager, Repository } from 'typeorm';

export interface WidgetStrategy {
  readonly type: IWidgetType;

  widgetsRepository: Repository<any>;

  createWidget(
    config: Record<string, any>,
    manager?: EntityManager,
  ): Promise<any>;

  updateWidget(widgetId: string, config: Record<string, any>): Promise<any>;

  getWidgetById(widgetId: string): Promise<any>;

  deleteWidget(widgetId: string): Promise<any>;
}
