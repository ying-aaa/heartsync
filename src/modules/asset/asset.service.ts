import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsAssetFieldEntity } from 'src/database/entities/hs-asset-field.entity';
import { DataSource, Repository } from 'typeorm';
import { HsAssetSyncService } from './asset-sync.service';
import { HsAssetTableEntity } from 'src/database/entities/hs-asset-table.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { HsLoggerService } from 'src/common/services/logger.service';
import { HsConnectionPoolService } from '../data-source/connection-pool.service';
import { HsDbFactoryService } from 'src/common/services/db-factory.service';
import { HsPaginationService } from 'src/common/services/pagination.service';

/**
 * 根据前端传入的参数，生成数据库表结构
 * 传递：
 * 1、几张表，每张表的表名 建立内部维护（考虑已有表里加入）
 * 2、关联关系 内部维护
 * 2、表对应关系 建立内部维护
 * 3、每张表字段 字段可以被多个表单或列表所使用
 */

@Injectable()
export class HsAssetService {
  constructor(
    @InjectRepository(HsAssetTableEntity)
    private assetTableRepo: Repository<HsAssetTableEntity>,
    @InjectRepository(HsAssetFieldEntity)
    private assetFieldRepo: Repository<HsAssetFieldEntity>,
    private hsAssetSyncService: HsAssetSyncService,
    private dataSource: DataSource,
    private logger: HsLoggerService,
    private dbFactoryService: HsDbFactoryService,
    private poolService: HsConnectionPoolService,
    private paginationService: HsPaginationService,
  ) {}

  // 创建资产
  async create(assetData: CreateAssetDto) {
    const { appId, name, dataSourceId, tableName } = assetData;
    // 查重
    const exist = await this.assetTableRepo.findOneBy({
      appId,
      name,
    });
    if (exist) {
      throw new BadRequestException(
        `该应用下已有名称为 '${name}' 的资产，换一个名称吧`,
      );
    }
    return this.dataSource.transaction(async (em) => {
      const newAsset = em.create(HsAssetTableEntity, assetData);
      const saved = await em.save(HsAssetTableEntity, newAsset);

      // 同步字段；这里如果抛 404，事务会整体回滚
      await this.hsAssetSyncService.syncTableFields(
        dataSourceId,
        tableName,
        saved.id,
      );
      return saved;
    });
  }

  async findAll(@Query() queryAssetDto: any) {
    return this.paginationService.paginate(this.assetTableRepo, queryAssetDto);
  }

  // 同步资产字段
  async syncAssetFields(assetId: string) {
    let assetData: HsAssetTableEntity;
    try {
      // 查询资产数据
      assetData = await this.assetTableRepo.findOneBy({ id: assetId });
    } catch (error) {
      throw new NotFoundException(`资产ID=${assetId}不存在`);
    }
    const { dataSourceId, tableName } = assetData;
    // 根据资产id查询
    return await this.hsAssetSyncService.syncTableFields(
      dataSourceId,
      tableName,
      assetId,
    );
  }

  // 根据资产id查询资产字段
  async getAssetFieldsById(assetId: string) {
    return this.assetFieldRepo.find({
      where: { assetId },
    });
  }

  // 根据appId查询资产列表
  async findAllByAppId(appId: string) {
    return this.assetTableRepo.find({
      where: { appId },
    });
  }

  // 根据资产id查询资产数据
  async findAssetData(assetId: string) {
    // 先查询数据源 id
    const assetMeta: HsAssetTableEntity = await this.assetTableRepo.findOneBy({
      id: assetId,
    });

    if (!assetMeta) {
      this.logger.warn(`资产元数据不存在，assetId=${assetId}`);
      throw new NotFoundException(`资产 ${assetId} 不存在`);
    }

    const { dataSourceId, tableName } = assetMeta;

    const factory = this.dbFactoryService;
    const poolService = factory.getPoolService();
    const strategy = await factory.getDbStrategy(dataSourceId); // 获取二合一策略
    const conn = await poolService.getConnection(dataSourceId);
    try {
      // 2. 调用策略的操作方法（建表）
      const result = await strategy.query(conn, `select * from ${tableName}`);
      if (!result.rows?.length) {
        this.logger.error(
          `查询资产数据失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
        );
        throw new NotFoundException(
          `查询资产数据失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
        );
      }
      this.logger.log(`查询资产数据：${JSON.stringify(result.rows)}`);

      return result.rows;
    } finally {
      await poolService.closeConnection(dataSourceId);
    }

    // const connection = await this.poolServcice.getConnection(dataSourceId);
    // const result = await connection.query(`select * from ${tableName}`);

    // this.poolServcice.closeConnection(dataSourceId);

    // if (!result.rows?.length) {
    //   this.logger.error(
    //     `查询资产数据失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
    //   );
    //   throw new NotFoundException(
    //     `查询资产失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
    //   );
    // }

    // this.logger.log(`查询资产数据：${JSON.stringify(result.rows)}`);

    // return result.rows;
  }
}
