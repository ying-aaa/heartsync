import { Injectable } from '@nestjs/common';
import { UnifiedDbStrategy } from '../database/abstract/unified-db-strategy.interface';
import { HsConnectionPoolService } from 'src/modules/data-source/connection-pool.service';
import { DbRegistry } from '../database/factory/db-registry';

@Injectable()
export class HsDbFactoryService {
  constructor(private poolService: HsConnectionPoolService) {}

  async getDbStrategy(dataSourceId: string): Promise<UnifiedDbStrategy> {
    const dbType = await this.poolService.getDbType(dataSourceId);
    if (!dbType) throw new Error(`数据源${dataSourceId}未初始化`);
    return DbRegistry.getStrategy(dbType);
  }

  // 暴露连接池服务（供业务层获取/释放连接）
  getPoolService(): HsConnectionPoolService {
    return this.poolService;
  }
}
