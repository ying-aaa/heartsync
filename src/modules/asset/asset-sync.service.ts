import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from 'mysql2/promise';
import { PoolClient } from 'pg';
import { HsAssetFieldEntity } from 'src/database/entities/hs-asset-field.entity';
import { HsDataSourceService } from '../data-source/data-source.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { HsConnectionPoolService } from '../data-source/connection-pool.service';
import { HsDbFactoryService } from 'src/common/services/db-factory.service';

// 数据库查询返回的字段原始信息（统一格式）
interface DbFieldRaw {
  fieldName: string; // 字段名
  fieldType: string; // 数据库类型（如varchar(255)、int）
  length?: number; // 长度
  isPrimary: boolean; // 是否主键
  notNull: boolean; // 是否非空
  comment?: string; // 字段注释
}

@Injectable()
export class HsAssetSyncService {
  // private readonly logger = new Logger(HsAssetSyncService.name);

  constructor(
    @InjectRepository(HsAssetFieldEntity)
    private assetFieldRepo: Repository<HsAssetFieldEntity>,
    private dataSourceService: HsDataSourceService,
    private dbFactoryService: HsDbFactoryService,
    private logger: HsLoggerService,
  ) {
    this.logger.setContext(HsAssetSyncService.name);
  }

  /**
   * 同步指定表的字段到 hs_asset_fields 表
   * @param dataSourceId 数据源ID
   * @param tableName 要同步的表名
   * @returns 同步结果（新增/更新/删除的数量）
   */
  async syncTableFields(
    dataSourceId: string,
    tableName: string,
    assetId: string,
  ) {
    // 1. 获取数据源配置（数据库类型、数据库名等）
    const dataSource = await this.dataSourceService.findOne(dataSourceId);

    // 2. 查询数据库表的最新字段信息（从系统表查询）
    const dbFields = await this.queryDbTableFields(
      dataSourceId,
      dataSource.type,
      dataSource.database,
      tableName,
    );
    this.logger.debug(`查询到${tableName}的字段共${dbFields.length}个`);

    // 3. 查询当前已同步的字段记录（未删除的）
    const existingFields = await this.assetFieldRepo.find({
      where: {
        dataSourceId,
        tableName,
        isDeleted: false,
      },
    });

    // 4. 开启事务，执行同步（新增/更新/删除）
    const queryRunner =
      this.assetFieldRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = {
        added: 0, // 新增数量
        updated: 0, // 更新数量
        deleted: 0, // 逻辑删除数量
      };

      // 5. 处理新增和更新
      for (const dbField of dbFields) {
        // 查找已存在的记录（通过 dataSourceId + tableName + name 唯一匹配）
        const existingField = existingFields.find(
          (f) => f.name === dbField.fieldName && !f.isDeleted,
        );

        if (!existingField) {
          // 5.1 新增：数据库有，本地无
          const newField = new HsAssetFieldEntity();
          newField.dataSourceId = dataSourceId;
          newField.assetId = assetId;
          newField.tableName = tableName;
          newField.name = dbField.fieldName;
          newField.type = dbField.fieldType; // 数据库原生类型
          newField.textType = this.mapToTextType(dbField.fieldType); // 映射到前端文本类型（如string/number）
          newField.length = dbField.length;
          newField.notNull = dbField.notNull;
          newField.comment = dbField.comment;
          newField.isPrimaryKey = dbField.isPrimary;
          newField.isShow = true; // 默认显示
          newField.sort = 100; // 默认排序
          newField.isDeleted = false;

          await queryRunner.manager.save(newField);
          result.added++;
        } else {
          // 5.2 更新：数据库和本地都有，更新差异字段
          const needUpdate = this.checkFieldNeedUpdate(existingField, dbField);
          if (needUpdate) {
            existingField.type = dbField.fieldType;
            existingField.textType = this.mapToTextType(dbField.fieldType);
            existingField.length = dbField.length;
            existingField.notNull = dbField.notNull;
            existingField.comment = dbField.comment;
            existingField.isPrimaryKey = dbField.isPrimary;
            existingField.updatedAt = new Date(); // 手动更新时间

            await queryRunner.manager.save(existingField);
            result.updated++;
          }
        }
      }

      // 6. 处理逻辑删除：本地有，数据库无（已从表中删除的字段）
      const dbFieldNames = dbFields.map((f) => f.fieldName);
      for (const existingField of existingFields) {
        if (
          !dbFieldNames.includes(existingField.name) &&
          !existingField.isDeleted
        ) {
          existingField.isDeleted = true;
          existingField.updatedAt = new Date();
          await queryRunner.manager.save(existingField);
          result.deleted++;
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `同步完成：${tableName}，新增${result.added}，更新${result.updated}，删除${result.deleted}`,
      );
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`同步失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 从数据库系统表查询字段信息（区分MySQL/PostgreSQL）
   */
  private async queryDbTableFields(
    dataSourceId: string,
    dbType: string,
    dbName: string,
    tableName: string,
  ): Promise<DbFieldRaw[]> {
    const poolService = this.dbFactoryService.getPoolService();
    const strategy = await this.dbFactoryService.getDbStrategy(dataSourceId); // 获取二合一策略
    const conn = await poolService.getConnection(dataSourceId);

    const rows = await strategy.getTableFields(conn, dbName, tableName);

    if (!rows?.length) {
      this.logger.error(
        `同步资产失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
      );
      throw new NotFoundException(
        `同步资产失败，数据源: ${dataSourceId} 下不存在表: ${tableName}`,
      );
    }

    return rows.map((row) => ({
      fieldName: row.fieldName,
      fieldType: row.fieldType,
      length: row.length,
      isPrimary: row.isPrimary,
      notNull: row.notNull,
      comment: row.comment,
    }));
  }

  /**
   * 数据库类型映射到前端文本类型（如varchar→string，int→number）
   */
  private mapToTextType(dbType: string): string {
    const typeLower = dbType.toLowerCase();
    if (
      typeLower.includes('varchar') ||
      typeLower.includes('char') ||
      typeLower.includes('text')
    ) {
      return 'string';
    } else if (
      typeLower.includes('int') ||
      typeLower.includes('float') ||
      typeLower.includes('double') ||
      typeLower.includes('decimal')
    ) {
      return 'number';
    } else if (typeLower.includes('bool')) {
      return 'boolean';
    } else if (
      typeLower.includes('date') ||
      typeLower.includes('time') ||
      typeLower.includes('timestamp')
    ) {
      return 'date';
    } else if (typeLower.includes('json') || typeLower.includes('object')) {
      return 'object';
    }
    return 'string'; // 默认映射为string
  }

  /**
   * 检查字段是否需要更新（对比数据库字段和本地记录的差异）
   */
  private checkFieldNeedUpdate(
    existing: HsAssetFieldEntity,
    dbField: DbFieldRaw,
  ): boolean {
    return (
      existing.type !== dbField.fieldType ||
      existing.length !== dbField.length ||
      existing.notNull !== dbField.notNull ||
      existing.comment !== dbField.comment ||
      existing.isPrimaryKey !== dbField.isPrimary
    );
  }
}
