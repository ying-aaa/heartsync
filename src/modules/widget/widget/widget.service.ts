import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HsWidgetEntity,
  WidgetType,
} from '../../../database/entities/hs-widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { HsWidgetServiceFactory } from '../widget-service.factory';
import { HsFileTreeService } from 'src/modules/file-tree/file-tree.service';
import { QueryWidgetDto } from './dto/query-widget.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { HsPaginationService } from 'src/common/services/pagination.service';
@Injectable()
export class HsWidgetService {
  constructor(
    @InjectRepository(HsWidgetEntity)
    private readonly widgetRepository: Repository<HsWidgetEntity>,
    private widgetServiceFactory: HsWidgetServiceFactory,
    private readonly fileTreeService: HsFileTreeService,
    private readonly paginationService: HsPaginationService,
  ) {}

  async create(
    createDto: CreateWidgetDto,
  ): Promise<HsWidgetEntity & { widgetTypeData: any }> {
    const data = {
      ...createDto,
      version: 1, // 初始版本
    };

    const { nodeId } = createDto;
    if (nodeId) {
      const nodeData = await this.fileTreeService.getNodeById(nodeId);
      if (nodeData) {
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

  async findAll(
    queryWidgetDto: QueryWidgetDto,
  ): Promise<PageDto<HsWidgetEntity>> {
    console.log('%c Line:60 🥔', 'color:#33a5ff', queryWidgetDto);
    return this.paginationService.paginate(
      this.widgetRepository,
      queryWidgetDto,
    );
  }

  async findByAppIdAndType(
    appId: string,
    type: WidgetType,
  ): Promise<HsWidgetEntity[]> {
    if (!type) {
      throw new Error('请传入正确的小部件类型');
    }
    return this.widgetRepository.find({
      where: { appId, type },
    });
  }

  async findOne(id: string): Promise<HsWidgetEntity> {
    const widget = await this.widgetRepository.findOneBy({ id });
    if (!widget) {
      throw new NotFoundException(`没有找到小部件 ${id}`);
    }
    return widget;
  }

  async update(
    id: string,
    updateDto: UpdateWidgetDto,
  ): Promise<HsWidgetEntity> {
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
