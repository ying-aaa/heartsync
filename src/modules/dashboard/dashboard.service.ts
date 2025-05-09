import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsDashboard } from 'src/database/entities/hs-dashboard.entity';
import { Repository } from 'typeorm';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { HsFileTreeService } from '../file-tree/file-tree.service';
@Injectable()
export class HsDashboardService {
  constructor(
    @InjectRepository(HsDashboard)
    private dashboardRepository: Repository<HsDashboard>,
    private readonly fileTreeService: HsFileTreeService,
  ) {}

  async create(createDashboardDto: CreateDashboardDto): Promise<HsDashboard> {
    const data = {
      ...createDashboardDto,
      version: 1, // 初始版本
    };
    const { nodeId } = createDashboardDto;

    if (nodeId) {
      const nodeData = await this.fileTreeService.getNodeById(nodeId);
      if (nodeData) {
        data['id'] = nodeId;
      }
    }

    const dashboard = this.dashboardRepository.create(data);
    const dashboardData = await this.dashboardRepository.save(dashboard);

    return dashboardData;
  }

  async update(
    id: string,
    updateData: Partial<HsDashboard>,
  ): Promise<HsDashboard> {
    await this.dashboardRepository.update(id, {
      ...updateData,
      version: () => 'version + 1',
    });
    return this.dashboardRepository.findOneBy({ id });
  }

  async findById(id: string): Promise<HsDashboard> {
    return this.dashboardRepository.findOneBy({ id });
  }

  async findAll(): Promise<HsDashboard[]> {
    return this.dashboardRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.dashboardRepository.delete(id);
  }
}
