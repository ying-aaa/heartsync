import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsWidget } from '../../../database/entities/hs-widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { HsWidgetServiceFactory } from '../widget-service.factory';
import { HsFileTreeService } from 'src/modules/file-tree/file-tree.service';
@Injectable()
export class HsWidgetService {
  constructor(
    @InjectRepository(HsWidget)
    private readonly widgetRepository: Repository<HsWidget>,
    private widgetServiceFactory: HsWidgetServiceFactory,
    private readonly fileTreeService: HsFileTreeService,
  ) {}

  async create(
    createDto: CreateWidgetDto,
  ): Promise<HsWidget & { widgetTypeData: any }> {
    const data = {
      ...createDto,
      version: 1, // 初始版本
    };
    const { nodeId } = createDto;
    const nodeData = await this.fileTreeService.getNodeById(nodeId);
    if (nodeData) {
      if (nodeId) {
        data['id'] = nodeId;
      }
    }

    const widget = this.widgetRepository.create(data);
    const widgetData = await this.widgetRepository.save(widget);

    const { id: widgetId, type, name } = widgetData;
    const widgetService = this.widgetServiceFactory.getService(type);

    const widgetTypeData = await widgetService.createWidget(widgetId, {
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
    const widgetData = await this.widgetRepository.findOne({
      where: { id },
    });

    if (!widgetData) {
      throw new NotFoundException(`没有找到小部件${id}`);
    }

    await this.widgetRepository.delete(id);

    const { id: widgetId, type } = widgetData;
    const widgetService = this.widgetServiceFactory.getService(type);
    await widgetService.deleteWidget(widgetId);
  }
}
