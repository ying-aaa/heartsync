import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsDashboardEntity } from 'src/database/entities/hs-dashboard.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { HsFileTreeService } from '../file-tree/file-tree.service';
import { HsWidgetService } from '../widget/widget/widget.service';
import {
  IDashboardConfig,
  IDashboardWidgetConfig,
  IWhetherStatus,
} from '@heartsync/types';
@Injectable()
export class HsDashboardService {
  constructor(
    @InjectRepository(HsDashboardEntity)
    private dashboardRepository: Repository<HsDashboardEntity>,
    private readonly dataSource: DataSource,
    private readonly fileTreeService: HsFileTreeService,
    private readonly widgetService: HsWidgetService,
  ) {}

  async create(
    createDashboardDto: CreateDashboardDto,
  ): Promise<HsDashboardEntity> {
    const data = {
      ...createDashboardDto,
    };
    const { nodeId, gridsterConfig } = createDashboardDto;
    const { gridsterWidget } = gridsterConfig;

    if (nodeId) {
      const nodeData = await this.fileTreeService.getNodeById(nodeId);
      if (nodeData) {
        data['id'] = nodeId;
      }
    }

    Reflect.deleteProperty(data, 'nodeId');

    await this.dataSource.transaction(async (manager) => {
      const dashboard = manager.create(HsDashboardEntity, data);
      await manager.save(dashboard);
      for (const widget of gridsterWidget) {
        if (widget.isNew === IWhetherStatus.YES) {
          await this.widgetService.create(
            {
              name: widget.name,
              type: widget.type,
              appId: dashboard.appId,
            },
            manager,
          );
          Reflect.deleteProperty(widget, 'isNew');
        }
      }

      return dashboard;
    });
  }

  async update(
    id: string,
    updateData: Partial<HsDashboardEntity>,
  ): Promise<HsDashboardEntity> {
    await this.dashboardRepository.update(id, {
      ...updateData,
    });
    return this.dashboardRepository.findOneBy({ id });
  }

  async findById(id: string): Promise<IDashboardConfig> {
    const dashboard = this.dashboardRepository.findOneBy({ id });
    const gridsterWidget = (await dashboard).gridsterConfig.gridsterWidget;
    const widgets: Record<string, IDashboardWidgetConfig> = {};
    for (const widget of gridsterWidget) {
      widgets[widget.id] = widget;
    }
  }

  async findAll(): Promise<HsDashboardEntity[]> {
    return this.dashboardRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.dashboardRepository.delete(id);
  }
}
