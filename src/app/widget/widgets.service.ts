import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Widget } from './widget.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Widget)
    private widgetsRepository: Repository<Widget>,
  ) {}

  async createWidget(createWidgetDto: any): Promise<Widget[]> {
    const widget = this.widgetsRepository.create(createWidgetDto);
    return await this.widgetsRepository.save(widget);
  }

  async getAllWidgets(): Promise<Widget[]> {
    return await this.widgetsRepository.find();
  }

  async getWidgetById(id: number): Promise<Widget> {
    return await this.widgetsRepository.findOneBy({ id });
  }

  async updateWidget(id: number, updateWidgetDto: any): Promise<Widget> {
    await this.widgetsRepository.update(id, updateWidgetDto);
    return await this.getWidgetById(id);
  }

  async deleteWidget(id: number): Promise<void> {
    await this.widgetsRepository.delete(id);
  }
}
