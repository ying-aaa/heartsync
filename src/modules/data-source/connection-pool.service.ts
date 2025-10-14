import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import mysql, { Pool as MysqlPool } from 'mysql2/promise';
import { Pool as PgPool, Client as PgClient } from 'pg';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { HsDataSourceService } from './data-source.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { CryptoUtil } from 'src/common/utils/crypto.util';

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
    { pool: MysqlPool | PgPool; lastUsed: number }
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
    this.startLongIdleCleanupTask();
  }

  /**
   * 测试数据源是否能成功建立连接（核心分离的连接测试功能）
   * @param dataSource 数据源配置实体
   * @returns 连接成功返回true，失败抛出错误
   */
  async testConnection(
    dataSource: HsDataSourceEntity,
  ): Promise<{ success: boolean; message: string }> {
    const { type, host, port, database, username, password } = dataSource;
    const decryptedPassword = CryptoUtil.decrypt(password);
    let connection: any = null;

    try {
      // 根据数据库类型创建临时连接
      if (type === 'mysql') {
        // MySQL临时连接
        connection = await mysql.createConnection({
          host,
          port,
          database,
          user: username,
          password: decryptedPassword,
        });
        // 执行测试查询
        await connection.execute('SELECT 1');
      } else if (type === 'postgres') {
        // PostgreSQL临时连接
        connection = new PgClient({
          host,
          port,
          database,
          user: username,
          password: decryptedPassword,
        });
        await connection.connect();
        // 执行测试查询
        await connection.query('SELECT 1');
      } else {
        throw new Error(`不支持的数据库类型：${type}`);
      }

      this.logger.debug(`数据源${dataSource.id}连接测试成功`);
      return { success: true, message: '连接成功' };
    } catch (error) {
      this.logger.error(`数据源${dataSource.id}连接测试失败：${error.message}`);
      return {
        success: false,
        message: `连接失败：${error.message || '未知错误'}`,
      };
    } finally {
      // 确保临时连接关闭，避免资源泄漏
      if (connection) {
        try {
          if (type === 'mysql') {
            await connection.end(); // 关闭MySQL连接
          } else if (type === 'postgres') {
            await connection.end(); // 关闭PostgreSQL连接
          }
        } catch (closeError) {
          this.logger.warn(`关闭测试连接失败：${closeError.message}`);
        }
      }
    }
  }

  /**
   * 获取数据源的连接池（LRU策略管理）
   */
  async getPool(dataSource: HsDataSourceEntity) {
    const { id: dataSourceId } = dataSource;
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
      return poolInfo.pool;
    }

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
      throw new Error(`数据源${dataSourceId}连接测试失败：${testRes.message}`);
    }
    const newPool = await this.createPool(dataSource);

    // 4. 加入映射和LRU队尾
    this.poolMap.set(dataSourceId, {
      pool: newPool,
      lastUsed: now,
    });
    this.lruQueue.push(dataSourceId);

    this.logger.debug(
      `创建新连接池：${dataSourceId}，当前LRU队列：${this.lruQueue}`,
    );
    return newPool;
  }

  /**
   * 从连接池获取可用连接（带有效性检测）
   */
  async getConnection(dataSourceId: string, type: string) {
    const poolInfo = this.poolMap.get(dataSourceId);
    if (!poolInfo) {
      this.logger.error(`数据源${dataSourceId}未初始化`);
      const dataSource = await this.dataSourceService.findOne(dataSourceId);
      await this.getPool(dataSource);
    }

    // 获取连接
    const connection =
      type === 'mysql'
        ? await (poolInfo.pool as MysqlPool).getConnection()
        : await (poolInfo.pool as PgPool).connect();

    // 检测连接有效性（复用测试逻辑的核心查询）
    try {
      if (type === 'mysql') {
        await connection.execute('SELECT 1'); // MySQL测试语句
      } else {
        await connection.query('SELECT 1'); // PostgreSQL测试语句
      }
      this.logger.debug(`从连接池${dataSourceId}获取有效连接`);
      return connection;
    } catch (error) {
      // 连接无效，关闭并抛出错误
      await this.closeConnection(connection, type);
      this.logger.error(`连接池${dataSourceId}的连接无效：${error.message}`);
      throw new Error(`连接无效：${error.message}`);
    }
  }

  /**
   * 关闭连接（放回连接池，而非真正关闭）
   */
  async closeConnection(connection: any, type: string) {
    if (type === 'mysql') {
      connection.release(); // mysql2连接放回池
    } else {
      connection.release(); // pg连接放回池
    }
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
   * 创建连接池（内部方法）
   */
  private async createPool(dataSource: HsDataSourceEntity) {
    const {
      type,
      host,
      port,
      database,
      username,
      password,
      maxPoolCount,
      minPoolCount,
    } = dataSource;
    const decryptedPassword = CryptoUtil.decrypt(password);

    if (type === 'mysql') {
      return mysql.createPool({
        host,
        port,
        database,
        user: username,
        password: decryptedPassword,
        waitForConnections: true, // 连接耗尽时等待
        connectionLimit: CONFIG.SINGLE_POOL_MAX_CONNECTIONS, // 单池最大连接数
        queueLimit: 0, // 等待队列无限制
        idleTimeout: CONFIG.IDLE_TIMEOUT, // 连接闲置超时
      });
    } else if (type === 'postgres') {
      return new PgPool({
        host,
        port,
        database,
        user: username,
        password: decryptedPassword,
        // max: CONFIG.SINGLE_POOL_MAX_CONNECTIONS, // 单池最大连接数
        max: maxPoolCount,
        min: minPoolCount,
        idleTimeoutMillis: CONFIG.IDLE_TIMEOUT, // 闲置超时
        connectionTimeoutMillis: 5000, // 连接超时
      });
    } else {
      throw new Error(`不支持的数据库类型：${type}`);
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
