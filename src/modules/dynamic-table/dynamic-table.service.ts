import { BadRequestException, Injectable } from '@nestjs/common';
import { HsConnectionPoolService } from '../data-source/connection-pool.service';
import { HsDataSourceService } from '../data-source/data-source.service';
import { HsAssetSyncService } from '../asset/asset-sync.service';
import { HsAssetService } from '../asset/asset.service';
import { IFieldType } from 'src/database/entities/hs-asset-field.entity';
import { HsLoggerService } from 'src/common/services/logger.service';
import { CreateTableDto } from './dto/creae-table.dto';

@Injectable()
export class HsDynamicTableService {
  constructor(
    private poolService: HsConnectionPoolService,
    private dataSourceService: HsDataSourceService,
    private assetService: HsAssetService,
    private assetSyncService: HsAssetSyncService,
    private logger: HsLoggerService,
  ) {}

  /**
   * 仅创建数据库物理表，不涉及元数据存储
   * @param dto 前端传递的建表配置
   */
  async createTable(dto: CreateTableDto) {
    const { dataSourceId, tableName, tableComment, fields } = dto;

    // 1. 基础校验：表名/字段名合法性
    this.validateTableName(tableName);
    fields.forEach((field) => this.validateFieldName(field.name));

    // 2. 校验主键唯一性（一张表只能有一个主键）
    const primaryFields = fields.filter((f) => f.isPrimaryKey);
    if (primaryFields.length > 1) {
      throw new BadRequestException('一张表只能设置一个主键字段');
    }

    // 3. 获取数据源配置（确定数据库类型：mysql/postgres）
    const dataSource = await this.dataSourceService.findOne(dataSourceId);
    if (!dataSource) {
      throw new BadRequestException(`数据源不存在：${dataSourceId}`);
    }
    const dbType = dataSource.type; // 数据库类型
    const dbName = dataSource.database; // 数据库名

    // 4. 检查目标数据库中表是否已存在
    const tableExists = await this.checkTableExists(
      dataSourceId,
      dbType,
      dbName,
      tableName,
    );
    if (tableExists) {
      throw new BadRequestException(
        `数据库中已存在表：${tableName}（数据源：${dataSourceId}）`,
      );
    }

    // 5. 生成CREATE TABLE SQL（根据数据库类型适配）
    const createTableSql = this.generateCreateTableSql(
      tableName,
      tableComment,
      fields,
      dbType,
    );
    this.logger.debug(`生成建表SQL：${createTableSql}`);

    // 6. 执行SQL创建表
    const connection = await this.poolService.getConnection(dataSourceId);
    try {
      await connection.query(createTableSql);
      this.logger.log(`表创建成功：${tableName}（数据库：${dbName}）`);
      return {
        success: true,
        message: `表${tableName}创建成功`,
        data: { tableName, dbName },
      };
    } catch (error) {
      this.logger.error(`建表失败：${error.message}`, error.stack);
      throw new BadRequestException(`创建表失败：${error.message}`);
    } finally {
      // 释放连接
      await this.poolService.closeConnection(dataSourceId);
    }
  }

  /**
   * 校验表名合法性（符合数据库命名规范）
   */
  private validateTableName(tableName: string): void {
    // 规则：仅包含字母、数字、下划线，不能以数字开头，长度≤64（多数数据库表名长度限制）
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]{0,63}$/;
    if (!regex.test(tableName)) {
      throw new BadRequestException(
        `表名不合法（只能包含字母、数字、下划线，不能以数字开头，长度≤64）：${tableName}`,
      );
    }
  }

  /**
   * 校验字段名合法性
   */
  private validateFieldName(fieldName: string): void {
    // 规则：同表名，长度≤64
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]{0,63}$/;
    if (!regex.test(fieldName)) {
      throw new BadRequestException(`字段名不合法：${fieldName}`);
    }
  }

  /**
   * 检查数据库中表是否已存在
   */
  private async checkTableExists(
    dataSourceId: string,
    dbType: string,
    dbName: string,
    tableName: string,
  ): Promise<boolean> {
    const connection = await this.poolService.getConnection(dataSourceId);
    try {
      let existsSql: string;
      let params: any[];

      if (dbType === 'mysql') {
        // MySQL：查询information_schema.tables
        existsSql = `
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = ? AND table_name = ?
        `;
        params = [dbName, tableName];
      } else if (dbType === 'postgres') {
        // PostgreSQL：查询pg_catalog.pg_tables
        existsSql = `
          SELECT 1 FROM pg_catalog.pg_tables 
          WHERE schemaname = $1 AND tablename = $2
        `;
        params = [dbName, tableName];
      } else {
        throw new BadRequestException(`不支持的数据库类型：${dbType}`);
      }

      const [rows] = await connection.query(existsSql, params);
      return (rows as any[]).length > 0; // 有记录则表示表已存在
    } finally {
      await this.poolService.closeConnection(dataSourceId);
    }
  }

  /**
   * 生成CREATE TABLE SQL（适配MySQL/PostgreSQL）
   */
  private generateCreateTableSql(
    tableName: string,
    tableComment: string,
    fields: CreateTableDto['fields'],
    dbType: string,
  ): string {
    // 字段SQL片段（如`id int NOT NULL PRIMARY KEY COMMENT '主键'`）
    const fieldSqls: string[] = fields.map((field) => {
      // 1. 映射前端类型到数据库类型
      const dbFieldType = this.mapFieldType(
        field.fieldType,
        dbType,
        field.length,
      );

      // 2. 处理约束（非空、主键）
      const constraints: string[] = [];
      if (field.notNull) constraints.push('NOT NULL');
      if (field.isPrimaryKey) constraints.push('PRIMARY KEY');

      // 3. 处理注释（不同数据库注释语法）
      const comment = field.comment
        ? dbType === 'mysql'
          ? `COMMENT '${this.escapeComment(field.comment)}'`
          : `COMMENT '${this.escapeComment(field.comment)}'`
        : '';

      // 拼接字段定义（字段名用反引号包裹，避免关键字冲突）
      return `\`${field.name}\` ${dbFieldType} ${constraints.join(' ')} ${comment}`.trim();
    });

    // 拼接表SQL（表名用反引号包裹，添加表注释）
    const tableCommentSql = tableComment
      ? dbType === 'mysql'
        ? `COMMENT '${this.escapeComment(tableComment)}'`
        : `COMMENT '${this.escapeComment(tableComment)}'`
      : '';

    return `
      CREATE TABLE \`${tableName}\` (
        ${fieldSqls.join(', \n  ')}
      ) ${tableCommentSql}
    `.trim();
  }

  /**
   * 前端字段类型映射到数据库原生类型
   */
  private mapFieldType(
    frontType: IFieldType,
    dbType: string,
    length?: number,
  ): string {
    switch (frontType) {
      case IFieldType.STRING:
        // varchar长度默认255，最大65535（MySQL）
        const strLength = length && length > 0 ? length : 255;
        return `varchar(${strLength})`;
      case IFieldType.NUMBER:
        return dbType === 'mysql' ? 'int' : 'int4'; // MySQL用int，PostgreSQL用int4
      case IFieldType.BOOLEAN:
        return dbType === 'mysql' ? 'tinyint(1)' : 'boolean'; // MySQL无boolean，用tinyint(1)
      case IFieldType.DATE:
        return dbType === 'mysql' ? 'datetime' : 'timestamp';
      case IFieldType.TEXT:
        return 'text'; // 长文本，无长度限制
      case IFieldType.JSON:
        return dbType === 'mysql' ? 'json' : 'jsonb'; // PostgreSQL推荐jsonb（支持索引）
      default:
        throw new BadRequestException(`不支持的字段类型：${frontType}`);
    }
  }

  /**
   * 转义注释中的单引号（避免SQL语法错误）
   */
  private escapeComment(comment: string): string {
    return comment.replace(/'/g, "''"); // 单引号替换为两个单引号（SQL转义规则）
  }
}
