import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HsWidgetEntity } from '../../../database/entities/hs-widget.entity';
import { HsWidgetServiceFactory } from '../widget-service.factory';
import { PageDto } from 'src/common/dtos/page.dto';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { BaseWidgetDto } from './dto/base-widget.dto';
import { IWidgetType } from '@heartsync/types';
import { QueryWidgetDto } from './dto/query-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
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
    manager?: EntityManager,
  ): Promise<HsWidgetEntity & { widgetTypeData: any }> {
    const { type } = createDto;

    const widgetService = this.widgetServiceFactory.getService(type);

    const widgetTypeData = await widgetService.createWidget(createDto, manager);
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
      throw new BadRequestException('请传入正确的小部件类型');
    }
    return this.widgetRepository.find({
      where: { appId, type },
    });
  }

  async findOne(id: string, type: IWidgetType): Promise<HsWidgetEntity> {
    const widgetService = this.widgetServiceFactory.getService(type);
    return widgetService.getWidgetById(id);
  }

  async update(
    id: string,
    type: IWidgetType,
    updateDto: UpdateWidgetDto,
  ): Promise<HsWidgetEntity> {
    const widgetService = this.widgetServiceFactory.getService(type);
    await this.findOne(id, type);
    return widgetService.updateWidget(id, updateDto);
  }

  async remove(id: string, type: IWidgetType): Promise<void> {
    const widgetService = this.widgetServiceFactory.getService(type);
    return widgetService.deleteWidget(id);
  }
}
