import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Pool as MysqlPool } from 'mysql2/promise';
import { Pool as PgPool } from 'pg';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { HsDataSourceService } from './data-source.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { initDbStrategies } from 'src/common/database/factory/db-registry.init';
import { DbRegistry } from 'src/common/database/factory/db-registry';
import { DbConfig } from 'src/common/database/abstract/unified-db-strategy.interface';

// 连接池配置（可通过环境变量动态调整）
const CONFIG = {
  MAX_POOL_COUNT: 5, // 最大连接池总数
  SINGLE_POOL_MAX_CONNECTIONS: 5, // 单个连接池的最大连接数
  IDLE_TIMEOUT: 30000, // 连接闲置超时（毫秒）
  LONG_IDLE_CLEANUP: 86400000, // 长期闲置清理阈值（24小时，毫秒）
};

@Injectable()
export class HsConnectionPoolService implements OnModuleInit {
  // 存储连接池：key=数据源ID，value={ pool: 连接池实例, lastUsed: 最后使用时间 }
  private poolMap = new Map<
    string,
    { pool: MysqlPool | PgPool; lastUsed: number; dbType: string }
  >();
  // LRU队列：按最近使用顺序存储数据源ID（队尾是最近使用的）
  private lruQueue: string[] = [];

  constructor(
    @Inject(forwardRef(() => HsDataSourceService))
    private dataSourceService: HsDataSourceService,
    private logger: HsLoggerService,
  ) {
    this.logger.setContext(HsConnectionPoolService.name);
  }

  // 模块初始化时启动长期闲置连接池清理任务
  onModuleInit() {
    initDbStrategies(); // 初始化注册所有二合一策略
    this.startLongIdleCleanupTask();
  }

  /**
   * 测试数据源是否能成功建立连接（核心分离的连接测试功能）
   * @param dataSource 数据源配置实体
   * @returns 连接成功返回true，失败抛出错误
   */
  async testConnection(dataSource: HsDataSourceEntity) {
    const strategy = DbRegistry.getStrategy(dataSource.type);
    const config = this.buildDbConfig(dataSource);
    return strategy.testConnection(config);
  }

  /**
   * 获取数据源的连接池（LRU策略管理）
   */
  async createPool(dataSourceId: string) {
    const now = Date.now();

    // 1. 若连接池已存在，更新其最后使用时间并移到LRU队尾
    if (this.poolMap.has(dataSourceId)) {
      const poolInfo = this.poolMap.get(dataSourceId);
      poolInfo.lastUsed = now; // 更新最后使用时间

      // 移到LRU队尾（标记为最近使用）
      this.updateLruQueue(dataSourceId);

      this.logger.debug(
        `复用连接池：${dataSourceId}，当前LRU队列：${this.lruQueue}`,
      );
      return poolInfo;
    }

    const dataSource = await this.dataSourceService.findOne(dataSourceId);
    const { type } = dataSource;
    // 2. 连接池不存在，检查是否超过最大数量，需要淘汰最少使用的
    if (this.lruQueue.length >= CONFIG.MAX_POOL_COUNT) {
      const lruDataSourceId = this.lruQueue.shift(); // 淘汰队首（最少使用）
      if (lruDataSourceId) {
        await this.destroyPool(lruDataSourceId);
        this.logger.debug(`淘汰最少使用的连接池：${lruDataSourceId}`);
      }
    }

    // 3. 先测试连接是否可用，再创建连接池
    const testRes = await this.testConnection(dataSource); // 使用分离的测试功能
    if (!testRes.success) {
      // throw new Error(`数据源${dataSourceId}连接测试失败：${testRes.message}`);
      this.logger.error(
        `数据源${dataSource.id}连接测试失败：${testRes.message}`,
      );
      throw new BadRequestException(
        `数据源${dataSource.id}连接测试失败：${testRes.message}`,
      );
    }

    const strategy = DbRegistry.getStrategy(type);
    const config = this.buildDbConfig(dataSource);
    const newPool = await strategy.createPool(config);

    // 4. 加入映射和LRU队尾
    this.poolMap.set(dataSourceId, {
      pool: newPool,
      dbType: type,
      lastUsed: now,
    });
    this.lruQueue.push(dataSourceId);

    this.logger.debug(
      `创建新连接池：${dataSourceId}，当前LRU队列：${this.lruQueue}`,
    );
    return this.poolMap.get(dataSourceId);
  }

  async getDbType(dataSourceId: string) {
    const poolInfo = await this.createPool(dataSourceId);

    return poolInfo?.dbType;
  }

  /**
   * 从连接池获取可用连接（带有效性检测）
   */
  async getConnection(dataSourceId: string) {
    const poolInfo = await this.createPool(dataSourceId);

    const strategy = DbRegistry.getStrategy(poolInfo.dbType);
    const conn = await strategy.getConnection(poolInfo.pool);
    await strategy.executeTestQuery(conn);
    return conn;
  }

  /**
   * 关闭连接（放回连接池，而非真正关闭）
   */
  async closeConnection(connectionId: string) {
    const poolInfo = await this.poolMap.get(connectionId);
    const strategy = DbRegistry.getStrategy(poolInfo.dbType);
    await strategy.releaseConnection(poolInfo.pool);
  }

  /**
   * 销毁指定连接池
   */
  async destroyPool(dataSourceId: string) {
    const poolInfo = this.poolMap.get(dataSourceId);
    if (!poolInfo) return;

    try {
      await poolInfo.pool.end();
      this.logger.debug(`销毁连接池：${dataSourceId}`);
    } catch (error) {
      this.logger.error(`销毁连接池${dataSourceId}失败：${error.message}`);
    } finally {
      // 从映射和队列中移除
      this.poolMap.delete(dataSourceId);
      const index = this.lruQueue.indexOf(dataSourceId);
      if (index > -1) {
        this.lruQueue.splice(index, 1);
      }
    }
  }

  /**
   * 更新LRU队列：将数据源ID移到队尾（标记为最近使用）
   */
  private updateLruQueue(dataSourceId: string) {
    const index = this.lruQueue.indexOf(dataSourceId);
    if (index > -1) {
      this.lruQueue.splice(index, 1); // 移除当前位置
    }
    this.lruQueue.push(dataSourceId); // 移到队尾
  }

  private buildDbConfig(dataSource: HsDataSourceEntity): DbConfig {
    return {
      // 1. 直接映射核心连接字段（过滤业务字段如id/name/description）
      host: dataSource.host,
      port: dataSource.port,
      database: dataSource.database,
      username: dataSource.username,

      // 2. 密码解密（核心安全步骤）
      password: CryptoUtil.decrypt(dataSource.password),

      // 3. 补全默认值（避免空值）
      maxPoolCount: dataSource.maxPoolCount || 5, // 没配置就用5
      minPoolCount: dataSource.minPoolCount || 0, // 没配置就用0
    };
  }

  /**
   * 启动长期闲置连接池清理任务（每小时执行一次）
   */
  private startLongIdleCleanupTask() {
    setInterval(async () => {
      const now = Date.now();
      const idleThreshold = CONFIG.LONG_IDLE_CLEANUP;

      // 遍历所有连接池，清理超过阈值的长期闲置连接池
      for (const [dataSourceId, poolInfo] of this.poolMap.entries()) {
        if (now - poolInfo.lastUsed > idleThreshold) {
          this.logger.debug(
            `清理长期闲置连接池：${dataSourceId}（${(now - poolInfo.lastUsed) / 3600000}小时未使用）`,
          );
          await this.destroyPool(dataSourceId);
        }
      }
    }, 3600000); // 每小时执行一次
  }
}
