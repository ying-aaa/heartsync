import { Injectable } from '@nestjs/common';
import { HsDataSourceService } from '../data-source/data-source.service';
import { HsConnectionPoolService } from '../data-source/connection-pool.service';

@Injectable()
export class HsFormSubmitService {
  constructor(
    private poolService: HsConnectionPoolService,
    private dataSourceService: HsDataSourceService,
  ) {}

  /**
   * 向目标数据源的表插入数据
   */
  async create(
    dataSourceId: string,
    tableName: string,
    data: Record<string, any>,
  ) {
    // 1. 获取数据源配置
    const dataSource = await this.dataSourceService.findOne(dataSourceId);
    if (!dataSource) {
      throw new Error(`数据源${dataSourceId}不存在`);
    }

    // 2. 获取连接池（自动触发LRU管理）
    await this.poolService.getPool(dataSource);

    // 3. 从连接池获取连接
    const connection = await this.poolService.getConnection(dataSourceId);

    try {
      // 4. 执行参数化插入（防SQL注入）
      const keys = Object.keys(data);
      const values = Object.values(data);
      let sql, result;

      if (dataSource.type === 'mysql') {
        const placeholders = keys.map(() => '?').join(',');
        sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
        [result] = await connection.execute(sql, values);
      } else {
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
        sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders}) RETURNING *`;
        const queryResult = await connection.query(sql, values);
        result = queryResult.rows[0];
      }

      return { success: true, data: result };
    } finally {
      // 5. 释放连接（放回连接池）
      await this.poolService.closeConnection(dataSourceId);
    }
  }
}
