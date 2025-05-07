import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsWidget } from '../entities/widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { HsWidgetServiceFactory } from '../widget-service.factory';
@Injectable()
export class HsWidgetService {
  constructor(
    @InjectRepository(HsWidget)
    private readonly widgetRepository: Repository<HsWidget>,
    private widgetServiceFactory: HsWidgetServiceFactory,
  ) {}

  async create(
    createDto: CreateWidgetDto,
  ): Promise<HsWidget & { widgetTypeData: any }> {
    const widget = this.widgetRepository.create({
      ...createDto,
      version: 1, // 初始版本
    });
    const widgetData = await this.widgetRepository.save(widget);

    const { id, type, name } = widgetData;
    const widgetService = this.widgetServiceFactory.getService(type);

    const widgetTypeData = await widgetService.createWidget(id, {
      formName: name,
    });
    return {
      ...widgetData,
      widgetTypeData,
      updateVersion: widgetData.updateVersion.bind(widgetData),
    };
  }

  async findAll(): Promise<HsWidget[]> {
    return this.widgetRepository.find();
  }

  async findOne(id: string): Promise<HsWidget> {
    const widget = await this.widgetRepository.findOneBy({ id });
    if (!widget) {
      throw new NotFoundException(`没有找到小部件 ${id}`);
    }
    return widget;
  }

  async update(id: string, updateDto: UpdateWidgetDto): Promise<HsWidget> {
    const widget = await this.findOne(id);
    const updated = this.widgetRepository.merge(widget, updateDto);
    return this.widgetRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.widgetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Widget ${id} not found`);
    }
  }
}
