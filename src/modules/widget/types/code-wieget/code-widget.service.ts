import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsCodeWidgetEntity } from '../../../../database/entities/hs-code-widget.entity';
import { WidgetStrategy } from '../../model/widget-strategy.interface';
import { WidgetType } from '../../../../database/entities/hs-widget.entity';

@Injectable()
export class HsCodeWidgetsService implements WidgetStrategy {
  type = WidgetType.CODE;

  constructor(
    @InjectRepository(HsCodeWidgetEntity)
    private hsCodeWidgetsRepository: Repository<HsCodeWidgetEntity>,
  ) {}

  async createWidget(
    widgetId: string,
    createHsCodeWidgetDto: any,
  ): Promise<HsCodeWidgetEntity> {
    const hsCodeWidget = this.hsCodeWidgetsRepository.create({
      ...createHsCodeWidgetDto,
      widgetId,
    });
    return await this.hsCodeWidgetsRepository.save(hsCodeWidget as any);
  }

  async getAllHsCodeWidgets(): Promise<HsCodeWidgetEntity[]> {
    return await this.hsCodeWidgetsRepository.find();
  }

  async getHsCodeWidgetById(widgetId: string): Promise<HsCodeWidgetEntity> {
    return await this.hsCodeWidgetsRepository.findOneBy({ widgetId });
  }

  async updateWidget(
    widgetId: string,
    updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidgetEntity> {
    await this.hsCodeWidgetsRepository.update(widgetId, updateHsCodeWidgetDto);
    return await this.getHsCodeWidgetById(widgetId);
  }

  async deleteWidget(widgetId: string): Promise<void> {
    await this.hsCodeWidgetsRepository.delete({ widgetId });
  }
}
