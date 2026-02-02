import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsWidgetEntity } from '../../../database/entities/hs-widget.entity';
import { HsWidgetServiceFactory } from '../widget-service.factory';
import { PageDto } from 'src/common/dtos/page.dto';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { BaseWidgetDto } from './dto/base-widget.dto';
import { IWidgetType } from '@heartsync/types';
import { QueryWidgetDto } from './dto/query-widget.dto';
@Injectable()
export class HsWidgetService {
  constructor(
    @InjectRepository(HsWidgetEntity)
    private readonly widgetRepository: Repository<HsWidgetEntity>,
    private widgetServiceFactory: HsWidgetServiceFactory,
    private readonly paginationService: HsPaginationService,
  ) {}

  async create(
    createDto: BaseWidgetDto,
  ): Promise<HsWidgetEntity & { widgetTypeData: any }> {
    const { type } = createDto;

    const widgetService = this.widgetServiceFactory.getService(type);

    const widgetTypeData = await widgetService.createWidget(createDto);
    return widgetTypeData;
  }

  async findAll(queryWidgetDto: QueryWidgetDto): Promise<PageDto<any>> {
    const { type } = queryWidgetDto;
    const widgetService = this.widgetServiceFactory.getService(type);
    return this.paginationService.paginate(
      widgetService.widgetsRepository,
      queryWidgetDto,
    );
  }

  async findByAppIdAndType(
    appId: string,
    type: IWidgetType,
  ): Promise<HsWidgetEntity[]> {
    if (!type) {
      throw new Error('请传入正确的小部件类型');
    }
    return this.widgetRepository.find({
      where: { appId, type },
    });
  }

  async findOne(id: string, type: IWidgetType): Promise<HsWidgetEntity> {
    const widgetService = this.widgetServiceFactory.getService(type);
    return widgetService.getWidgetById(id);
  }

  async update(id: string, updateDto: BaseWidgetDto): Promise<HsWidgetEntity> {
    const widget = await this.findOne(id, updateDto.type);
    const updated = this.widgetRepository.merge(widget, updateDto);
    return this.widgetRepository.save(updated);
  }

  async remove(id: string, type: IWidgetType): Promise<void> {
    const widgetService = this.widgetServiceFactory.getService(type);
    await widgetService.deleteWidget(id);
  }
}
