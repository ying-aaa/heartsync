import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from 'mysql2/promise';
import { PoolClient } from 'pg';
import { HsConnectionPoolService } from '../../common/services/connection-pool.service'; // 连接池服务
import { HsAssetFieldEntity } from 'src/database/entities/hs-asset-field.entity';
import { HsDataSourceService } from '../data-source/data-source.service';
import { HsLoggerService } from 'src/common/services/logger.service';

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
    private poolService: HsConnectionPoolService,
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
  async syncTableFields(dataSourceId: string, tableName: string) {
    // 1. 获取数据源配置（数据库类型、数据库名等）
    const dataSource = await this.dataSourceService.findOne(dataSourceId);

    await this.poolService.getPool(dataSource);

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
        console.log('%c Line:80 🍢 dbField', 'color:#42b983', dbField);
        // 查找已存在的记录（通过 dataSourceId + tableName + name 唯一匹配）
        const existingField = existingFields.find(
          (f) => f.name === dbField.fieldName && !f.isDeleted,
        );

        if (!existingField) {
          // 5.1 新增：数据库有，本地无
          const newField = new HsAssetFieldEntity();
          newField.dataSourceId = dataSourceId;
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
    const connection = await this.poolService.getConnection(
      dataSourceId,
      dbType,
    );
    try {
      if (dbType === 'mysql') {
        return this.queryMysqlFields(
          connection as Connection,
          dbName,
          tableName,
        );
      } else if (dbType === 'postgres') {
        return this.queryPostgresFields(
          connection as PoolClient,
          dbName,
          tableName,
        );
      } else {
        throw new Error(`不支持的数据库类型：${dbType}`);
      }
    } finally {
      await this.poolService.closeConnection(connection, dbType);
    }
  }

  /**
   * MySQL查询字段信息（从information_schema.columns）
   */
  private async queryMysqlFields(
    connection: Connection,
    dbName: string,
    tableName: string,
  ): Promise<DbFieldRaw[]> {
    const sql = `
      SELECT
        COLUMN_NAME AS fieldName,
        CONCAT(DATA_TYPE, IF(CHARACTER_MAXIMUM_LENGTH IS NOT NULL, CONCAT('(', CHARACTER_MAXIMUM_LENGTH, ')'), '')) AS fieldType,
        CHARACTER_MAXIMUM_LENGTH AS length,
        (COLUMN_KEY = 'PRI') AS isPrimary,
        (IS_NULLABLE = 'NO') AS notNull,
        COLUMN_COMMENT AS comment
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `;
    const [rows] = await connection.execute(sql, [dbName, tableName]);
    return (rows as any[]).map((row) => ({
      fieldName: row.fieldName,
      fieldType: row.fieldType,
      length: row.length,
      isPrimary: row.isPrimary,
      notNull: row.notNull,
      comment: row.comment,
    }));
  }

  /**
   * PostgreSQL查询字段信息（从pg_catalog系统表）
   */
  private async queryPostgresFields(
    connection: PoolClient,
    dbName: string,
    tableName: string,
  ): Promise<DbFieldRaw[]> {
    const sql = `
      SELECT
          a.attname                                       AS "fieldName",
          regexp_replace(
              pg_catalog.format_type(a.atttypid, a.atttypmod),
              'character varying', 'varchar', 'i')        AS "fieldType",
          CASE WHEN a.atttypmod > 0 THEN a.atttypmod - 4 END AS "length",
          pg_catalog.col_description(c.oid, a.attnum)     AS "comment",
          regexp_replace(pg_get_expr(d.adbin, d.adrelid),
                        '::character varying', '', 'g')  AS "defaultValue",
          CASE WHEN a.attnotnull THEN 'YES' ELSE 'NO' END AS "notNull",
          CASE WHEN pk.attnum IS NOT NULL THEN 'YES' ELSE 'NO' END AS "isPrimary",
          CASE
              WHEN EXISTS (
                  SELECT 1
                  FROM pg_constraint
                  WHERE conrelid = a.attrelid
                    AND a.attnum = ANY(conkey)
                    AND contype IN ('p', 'u') 
              ) THEN 'YES'
              ELSE 'NO'
          END                                             AS "unique",
          CASE WHEN a.attidentity = 'd' THEN 'YES' ELSE 'NO' END AS "addSelf"
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
      LEFT JOIN (
          SELECT conrelid, unnest(conkey) AS attnum
          FROM pg_constraint
          WHERE contype = 'p'
      ) pk ON pk.conrelid = a.attrelid AND pk.attnum = a.attnum
      WHERE c.relname = '${tableName}'
        AND a.attnum > 0
        AND NOT a.attisdropped
      ORDER BY a.attnum;
    `;
    const result = await connection.query(sql);

    if (!result.rows?.length) {
      this.logger.error(`表${tableName}不存在`);
      throw new NotFoundException(`表${tableName}不存在`);
    }

    return result.rows.map((row) => ({
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
