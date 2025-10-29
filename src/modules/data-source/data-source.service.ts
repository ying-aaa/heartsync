import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtil } from 'src/common/utils/crypto.util';
// import { DriverManager } from 'src/common/utils/driver-manager.util';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { Repository } from 'typeorm';
import { HsConnectionPoolService } from './connection-pool.service';
import { PageDto } from 'src/common/dtos/page.dto';
import { QueryDataSourceDto } from './dto/query-data-source.dto';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsDbFactoryService } from 'src/common/services/db-factory.service';
import { HsLoggerService } from 'src/common/services/logger.service';

/**
 * 数据源服务：处理数据源的CRUD、连接测试、表列表查询
 */
@Injectable()
export class HsDataSourceService {
  constructor(
    // 注入数据源实体的Repository（TypeORM自动生成）
    @InjectRepository(HsDataSourceEntity)
    private dataSourceRepo: Repository<HsDataSourceEntity>,
    @Inject(forwardRef(() => HsConnectionPoolService))
    private poolService: HsConnectionPoolService,
    private paginationService: HsPaginationService,
    private dbFactoryService: HsDbFactoryService,
    private logger: HsLoggerService,
  ) {
    this.logger.setContext(HsDataSourceService.name);
  }

  /**
   * 创建数据源（密码加密存储）
   * @param data 数据源配置（明文密码）
   * @returns 创建后的数据源实体
   */
  async create(data: Partial<HsDataSourceEntity>) {
    const { appId, name, type, password } = data;
    // 查询相同appId和相同name的是否已存在
    const existing = await this.dataSourceRepo.findOneBy({
      appId,
      name,
      type,
    });
    if (existing) {
      throw new BadRequestException(
        `该应用下已有名称为 '${name}' 的 ${type} 数据源，换一个名称吧`,
      ); // 抛出异常，框架会转 400
    }

    try {
      // 1. 加密密码
      const encryptedPwd = CryptoUtil.encrypt(password || '');
      // 2. 构建实体
      const dataSource = this.dataSourceRepo.create({
        ...data,
        password: encryptedPwd, // 存储加密后的密码
        status: 'offline', // 初始状态离线
      });
      // 3. 保存到元数据库
      const saved = await this.dataSourceRepo.save(dataSource);
      // 4. 自动测试连接并更新状态
      const testRes = await this.poolService.testConnection(saved);
      if (testRes.success) {
        saved.status = 'online';
        await this.dataSourceRepo.update(saved.id, { status: 'online' });
      }
      return saved;
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException(e.detail);
      }
      throw e; // 其它异常继续向上抛，框架会转 500
    }
  }

  /**
   * 获取所有数据源列表
   * @returns 数据源实体数组
   */
  async findAll(
    queryApplicationDto: QueryDataSourceDto,
  ): Promise<PageDto<HsDataSourceEntity>> {
    return this.paginationService.paginate(
      this.dataSourceRepo,
      queryApplicationDto,
    );
  }

  /**
   * 根据ID获取单个数据源
   * @param id 数据源ID
   * @returns 数据源实体
   */
  async findOne(id: string) {
    try {
      const dataSource = await this.dataSourceRepo.findOneBy({ id });
      if (!dataSource) throw '';
      return dataSource;
    } catch (error) {
      throw new NotFoundException(`数据源ID=${id}不存在`);
    }
  }

  // 根据请求源信息测试🔗
  async testConnection(data: Partial<HsDataSourceEntity>) {
    const encryptedPwd = CryptoUtil.encrypt(data.password || '');
    const dataSource = this.dataSourceRepo.create({
      ...data,
      password: encryptedPwd,
    });
    return this.poolService.testConnection(dataSource);
  }

  /**
   * 测试数据源连接（单独触发）
   * @param id 数据源ID
   * @returns 连接结果
   */
  async testConnectionById(id: string) {
    const dataSource = await this.findOne(id);
    const testRes = await this.poolService.testConnection(dataSource);
    // 同步更新数据源状态
    if (testRes.success !== (dataSource.status === 'online')) {
      await this.dataSourceRepo.update(id, {
        status: testRes.success ? 'online' : 'offline',
      });
    }
    return testRes;
  }

  /**
   * 删除数据源
   * @param id 数据源ID
   * @returns 删除结果
   */
  async remove(id: string) {
    await this.findOne(id); // 先校验是否存在
    await this.dataSourceRepo.delete(id);
    // return { success: true, message: '数据源删除成功' };
  }

  /**
   * 获取数据源下的数据库模式
   * @param id 数据源ID
   * @returns 表列表
   */
  async getSchemas(dataSourceId: string) {
    const factory = this.dbFactoryService;
    const poolService = factory.getPoolService();
    const strategy = await factory.getDbStrategy(dataSourceId); // 获取二合一策略
    const conn = await poolService.getConnection(dataSourceId);
    const sql = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog')
    `;
    try {
      // 2. 调用策略的操作方法（建表）
      const result = await strategy.query(conn, sql);
      if (!result.rows?.length) {
        this.logger.error(`查询数据源${dataSourceId}下的数据库模式失败`);
        throw new NotFoundException(
          `查询数据源${dataSourceId}下的数据库模式失败`,
        );
      }
      this.logger.log(
        `查询数据源${dataSourceId}下的数据库模式：${JSON.stringify(result.rows)}`,
      );

      return result.rows;
    } finally {
      await poolService.closeConnection(dataSourceId);
    }
  }

  /**
   * 获取数据源下的表列表
   * @param id 数据源ID
   * @returns 表列表
   */
  async getTables(dataSourceId: string, schemaName: string) {
    const factory = this.dbFactoryService;
    const poolService = factory.getPoolService();
    const strategy = await factory.getDbStrategy(dataSourceId);
    const conn = await poolService.getConnection(dataSourceId);
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1 AND table_type = 'BASE TABLE'
    `;

    try {
      const result = await strategy.query(conn, sql, [schemaName]);
      if (!result.rows?.length) {
        this.logger.error(`查询数据源${dataSourceId}下的数据库表失败`);
        throw new NotFoundException(
          `查询数据源${dataSourceId}下的数据库表失败`,
        );
      }
      this.logger.log(
        `查询数据源${dataSourceId}下的数据库表：${JSON.stringify(result.rows)}`,
      );

      return result.rows;
    } finally {
      await poolService.closeConnection(dataSourceId);
    }
  }
}
