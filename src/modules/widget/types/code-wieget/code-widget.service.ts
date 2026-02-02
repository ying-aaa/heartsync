import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsCodeWidgetEntity } from '../../../../database/entities/hs-code-widget.entity';
import { WidgetStrategy } from '../../model/widget-strategy.interface';
import { IWidgetType } from '@heartsync/types';

@Injectable()
export class HsCodeWidgetsService implements WidgetStrategy {
  type = IWidgetType.CODE;

  constructor(
    @InjectRepository(HsCodeWidgetEntity)
    public widgetsRepository: Repository<HsCodeWidgetEntity>,
  ) {}

  async createWidget(createHsCodeWidgetDto: any): Promise<HsCodeWidgetEntity> {
    const hsCodeWidget = this.widgetsRepository.create(createHsCodeWidgetDto);
    return await this.widgetsRepository.save(hsCodeWidget as any);
  }

  async getAllHsCodeWidgets(): Promise<HsCodeWidgetEntity[]> {
    return await this.widgetsRepository.find();
  }

  async getWidgetById(id: string): Promise<HsCodeWidgetEntity> {
    return await this.widgetsRepository.findOneBy({ id });
  }

  async updateWidget(
    id: string,
    updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidgetEntity> {
    await this.widgetsRepository.update(id, updateHsCodeWidgetDto);
    return await this.getWidgetById(id);
  }

  async deleteWidget(id: string): Promise<void> {
    await this.widgetsRepository.delete({ id });
  }
}
