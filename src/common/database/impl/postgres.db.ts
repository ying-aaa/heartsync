import {
  UnifiedDbStrategy,
  DbConfig,
  DbPool,
  DbConnection,
  DbQueryResult,
  FieldConfig,
} from '../abstract/unified-db-strategy.interface';
import type { Pool as PgPool, PoolClient } from 'pg'; // 仅导入类型，不加载库

export class PostgresDb implements UnifiedDbStrategy {
  // 1. 基础标识（数据库类型）
  type = 'postgres';

  // 2. 动态懒加载pg库（仅在首次使用时加载，减少初始依赖）
  private async importPg() {
    const pg = await import('pg'); // 动态导入pg库
    return pg;
  }

  // 3. 连接管理方法（原Strategy职责）
  /** 测试PostgreSQL连接有效性 */
  async testConnection(
    config: DbConfig,
  ): Promise<{ success: boolean; message: string }> {
    const { Client } = await this.importPg();
    const client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    });

    try {
      await client.connect();
      await this.executeTestQuery(client); // 执行测试查询
      return { success: true, message: 'PostgreSQL连接测试成功' };
    } catch (error) {
      return {
        success: false,
        message: `PostgreSQL连接失败：${(error as Error).message}`,
      };
    } finally {
      await client.end(); // 确保连接关闭
    }
  }

  /** 创建PostgreSQL连接池 */
  async createPool(config: DbConfig): Promise<DbPool> {
    const { Pool } = await this.importPg();
    return new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      max: config.maxPoolCount || 5, // 最大连接数
      min: config.minPoolCount || 0, // 最小空闲连接数
      idleTimeoutMillis: 30000, // 连接闲置超时
      connectionTimeoutMillis: 5000, // 连接建立超时
    });
  }

  /** 从连接池获取单个连接 */
  async getConnection(pool: DbPool): Promise<DbConnection> {
    return (pool as PgPool).connect(); // 返回PoolClient
  }

  /** 释放连接（放回连接池） */
  async releaseConnection(conn: DbConnection): Promise<void> {
    // (conn as PoolClient).release(); // PostgreSQL连接自身的release方法
  }

  /** 关闭连接池 */
  async closePool(pool: DbPool): Promise<void> {
    await (pool as PgPool).end(); // 关闭整个连接池
  }

  /** 执行测试查询（验证连接有效性） */
  async executeTestQuery(conn: DbConnection): Promise<void> {
    await (conn as PoolClient).query('SELECT 1'); // PostgreSQL测试语句
  }

  // 4. 操作实现方法（原DbService职责）
  /** 执行查询（SELECT/UPDATE/DELETE） */
  async query(
    conn: DbConnection,
    sql: string,
    params?: any[],
  ): Promise<DbQueryResult> {
    const result = await (conn as PoolClient).query(sql, params || []);
    return {
      rows: result.rows, // 查询结果行
      affectedRows: result.rowCount, // 受影响的行数（PostgreSQL用rowCount）
    };
  }

  /** 插入数据（INSERT） */
  async insert(
    conn: DbConnection,
    tableName: string,
    data: Record<string, any>,
  ): Promise<DbQueryResult> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    // PostgreSQL占位符用$1, $2...（索引从1开始）
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(',');
    // 字段名用双引号包裹（避免关键字冲突，PostgreSQL区分大小写）
    const sql = `
      INSERT INTO "${tableName}" (${keys.map((key) => `"${key}"`).join(',')}) 
      VALUES (${placeholders})
      RETURNING *  -- PostgreSQL通过RETURNING返回插入的行
    `;
    const result = await this.query(conn, sql, values);
    return {
      ...result,
      insertId: result.rows[0]?.id, // 假设主键名为id，可根据实际调整
    };
  }

  /** 创建表（CREATE TABLE） */
  async createTable(
    conn: DbConnection,
    tableName: string,
    fields: FieldConfig[],
  ): Promise<void> {
    const fieldSqls = fields.map((field) => {
      // 处理约束（非空、主键）
      const constraints = [
        field.notNull ? 'NOT NULL' : '',
        field.isPrimaryKey ? 'PRIMARY KEY' : '',
      ].filter(Boolean); // 过滤空字符串

      // 处理字段类型（如varchar(255)、jsonb等）
      const fieldType = field.length
        ? `${field.dbType}(${field.length})`
        : field.dbType;

      // PostgreSQL字段名用双引号，注释语法与MySQL一致
      return `"${field.name}" ${fieldType} ${constraints.join(' ')} COMMENT '${field.comment || ''}'`;
    });

    // 拼接建表SQL（表名用双引号）
    const sql = `
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        ${fieldSqls.join(', \n  ')}
      )
    `;
    await this.query(conn, sql);
  }

  /** 查询表字段信息（适配PostgreSQL系统表） */
  async getTableFields(
    conn: DbConnection,
    dbName: string,
    tableName: string,
  ): Promise<FieldConfig[]> {
    // 查询PostgreSQL系统表获取字段信息
    const sql = `
      SELECT 
        a.attname as name,  -- 字段名
        t.typname as dbType,  -- 数据库类型（如varchar、int4）
        -- 处理长度（varchar类型的长度需要计算：atttypmod - 4）
        CASE WHEN t.typname = 'varchar' THEN (a.atttypmod - 4) ELSE NULL END as length,
        a.attnotnull as notNull,  -- 是否非空
        -- 判断是否为主键
        EXISTS (
          SELECT 1 FROM pg_constraint c
          WHERE c.conrelid = a.attrelid AND c.contype = 'p' AND a.attnum = ANY(c.conkey)
        ) as isPrimaryKey,
        col_description(a.attrelid, a.attnum) as comment  -- 字段注释
      FROM pg_attribute a
      JOIN pg_type t ON a.atttypid = t.oid
      WHERE 
        -- 关联表（pg_class存储表信息，relname是表名）
        a.attrelid = (SELECT oid FROM pg_class WHERE relname = $1)
        -- 关联 schema（pg_namespace存储命名空间，nspname是库名）
        AND pg_get_userbyid(a.attrelid::regclass::pg_namespace.oid) = $2
        AND a.attnum > 0  -- 排除系统字段（attnum <= 0是系统字段）
        AND NOT a.attisdropped  -- 排除已删除的字段
      ORDER BY a.attnum  -- 按字段创建顺序排序
    `;

    const { rows } = await this.query(conn, sql, [tableName, dbName]);
    return rows as FieldConfig[];
  }
}
