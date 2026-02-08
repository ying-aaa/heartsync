import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsDashboardEntity } from 'src/database/entities/hs-dashboard.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { HsFileTreeService } from '../file-tree/file-tree.service';
import { HsWidgetService } from '../widget/widget/widget.service';
import {
  IDashboardConfig,
  IDashboardWidgetConfig,
  IWhetherStatus,
  IWidgetContext,
  IWidgetTypesConfig,
} from '@heartsync/types';
import { HsWidgetEntity } from 'src/database/entities/hs-widget.entity';
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
  ): Promise<IDashboardConfig> {
    const data = {
      ...createDashboardDto,
    };
    const nodeId = createDashboardDto.nodeId;

    if (nodeId) {
      const nodeData = await this.fileTreeService.getNodeById(nodeId);
      if (nodeData) {
        data['id'] = nodeId;
      }
    }

    const gridsterConfig = createDashboardDto.gridsterConfig;
    const { gridsterWidgets } = gridsterConfig;

    return this.dataSource.transaction(async (manager) => {
      const dashboard = manager.create(HsDashboardEntity, data);
      await manager.save(dashboard);
      for (const widget of gridsterWidgets) {
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
  ): Promise<IDashboardConfig> {
    const { gridsterConfig, name } = updateData;
    const { gridsterWidgets } = gridsterConfig;
    return this.dashboardRepository.manager.transaction(async (manager) => {
      for (let i = 0; i < gridsterWidgets.length; i++) {
        const widget = gridsterWidgets[i];
        if (widget.isNew === IWhetherStatus.YES) {
          const widgetData = await this.widgetService.create(
            {
              name: widget.name || '【仪表板】' + name + '部件' + i,
              type: widget.type,
              appId: updateData.appId,
            },
            manager,
          );
          widget.widgetId = widgetData.id;
        }
        Reflect.deleteProperty(widget, 'isNew');
      }
      await manager.update(this.dashboardRepository.metadata.target, id, {
        ...updateData,
      });

      return this.findById(id, manager);
    });
  }

  async findById(
    id: string,
    manager?: EntityManager,
  ): Promise<IDashboardConfig> {
    const findLogic = async (manager) => {
      const dashboard = await manager.findOne(HsDashboardEntity, {
        where: { id },
      });
      const gridsterWidgets = dashboard.gridsterConfig.gridsterWidgets;
      const widgets: IWidgetContext = {} as IWidgetContext;
      for (const widget of gridsterWidgets) {
        widgets[widget.widgetId] = await this.widgetService.findOne(
          widget.widgetId,
          widget.type,
          manager,
        );
      }
      return {
        ...dashboard,
        widgets,
      };
    };
    if (manager) {
      return findLogic(manager);
    } else {
      return this.dashboardRepository.manager.transaction(async (manager) => {
        return findLogic(manager);
      });
    }
  }

  async findAll(): Promise<HsDashboardEntity[]> {
    return this.dashboardRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.dashboardRepository.delete(id);
  }
}
