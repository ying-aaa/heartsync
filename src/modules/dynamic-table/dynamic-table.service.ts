import { BadRequestException, Injectable } from '@nestjs/common';
import { HsConnectionPoolService } from '../data-source/connection-pool.service';
import { HsDataSourceService } from '../data-source/data-source.service';
import { IFieldType } from 'src/database/entities/hs-asset-field.entity';
import { HsLoggerService } from 'src/common/services/logger.service';
import { CreateTableDto } from './dto/creae-table.dto';

@Injectable()
export class HsDynamicTableService {
  constructor(
    private poolService: HsConnectionPoolService,
    private dataSourceService: HsDataSourceService,
    private logger: HsLoggerService,
  ) {
    this.logger.setContext(HsDynamicTableService.name);
  }

  /**
   * 仅创建数据库物理表，不涉及元数据存储
   * @param dto 前端传递的建表配置
   */
  async createTable(dto: CreateTableDto) {
    const { dataSourceId, tableName, tableComment, fields } = dto;

    const dataSource = await this.dataSourceService.findOne(dataSourceId);
    if (!dataSource) {
      throw new BadRequestException(`数据源不存在：${dataSourceId}`);
    }
    const dbType = dataSource.type; // 数据库类型
    const dbName = dataSource.database; // 数据库名

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
        params = [tableName];
      } else if (dbType === 'postgres') {
        // PostgreSQL：查询pg_catalog.pg_tables
        existsSql = `
          SELECT 1 FROM pg_catalog.pg_tables 
          WHERE tablename = $1
        `;
        params = [tableName];
      } else {
        throw new BadRequestException(`不支持的数据库类型：${dbType}`);
      }
      const result = await connection.query(existsSql, params);
      const rows = result.rows;

      return (rows as any[]).length > 0;
    } finally {
      await this.poolService.closeConnection(dataSourceId);
    }
  }

  /**
   * 获取数据库对应的标识符分隔符（表名、字段名包裹符号）
   * @param dbType 数据库类型
   * @returns [开始符号, 结束符号]
   */
  private getIdentifierQuotes(dbType: string): [string, string] {
    switch (dbType.toLowerCase()) {
      case 'mysql':
        return ['`', '`']; // MySQL用反引号
      case 'postgresql':
      case 'oracle':
        return ['"', '"']; // PostgreSQL/Oracle用双引号
      case 'sqlserver':
        return ['[', ']']; // SQL Server用方括号
      default:
        return ['', '']; // 其他数据库默认不包裹（或根据需求调整）
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
    // 获取当前数据库的标识符分隔符
    const [quoteStart, quoteEnd] = this.getIdentifierQuotes(dbType);

    // 字段SQL片段
    const fieldSqls: string[] = fields.map((field) => {
      const dbFieldType = this.mapFieldType(
        field.fieldType,
        dbType,
        field.length,
      );

      const constraints: string[] = [];
      if (field.notNull) constraints.push('NOT NULL');
      if (field.isPrimaryKey) constraints.push('PRIMARY KEY');

      // 处理注释（保持不变，大部分数据库兼容）
      const comment = field.comment
        ? `COMMENT '${this.escapeComment(field.comment)}'`
        : '';

      // 用动态分隔符包裹字段名
      return `${quoteStart}${field.name}${quoteEnd} ${dbFieldType} ${constraints.join(' ')} ${comment}`.trim();
    });

    // 表注释（保持不变）
    const tableCommentSql = tableComment
      ? `COMMENT '${this.escapeComment(tableComment)}'`
      : '';

    // 用动态分隔符包裹表名
    return `
      CREATE TABLE ${quoteStart}${tableName}${quoteEnd} (
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
