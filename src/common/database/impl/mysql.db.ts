import {
  UnifiedDbStrategy,
  DbConfig,
  DbPool,
  DbConnection,
  DbQueryResult,
  FieldConfig,
} from '../abstract/unified-db-strategy.interface';
import type { Pool as MysqlPool, PoolConnection } from 'mysql2/promise'; // 仅类型导入

export class MysqlDb implements UnifiedDbStrategy {
  // 1. 基础标识
  type = 'mysql';

  // 2. 动态懒加载mysql2库（仅在需要时加载）
  private async importMysql() {
    const mysql = await import('mysql2/promise');
    return mysql;
  }

  // 3. 连接管理方法（原Strategy职责）
  async testConnection(
    config: DbConfig,
  ): Promise<{ success: boolean; message: string }> {
    const mysql = await this.importMysql();
    let conn: PoolConnection | any | null = null;
    try {
      conn = await mysql.createConnection({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.username,
        password: config.password,
      });
      await this.executeTestQuery(conn);
      return { success: true, message: 'MySQL连接测试成功' };
    } catch (error) {
      return {
        success: false,
        message: `MySQL连接失败：${(error as Error).message}`,
      };
    } finally {
      if (conn) await conn.end();
    }
  }

  async createPool(config: DbConfig): Promise<DbPool> {
    const mysql = await this.importMysql();
    return mysql.createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      connectionLimit: config.maxPoolCount || 5,
      idleTimeout: 30000,
    });
  }

  async getConnection(pool: DbPool): Promise<DbConnection> {
    return (pool as MysqlPool).getConnection();
  }

  async releaseConnection(conn: DbConnection): Promise<void> {
    (conn as PoolConnection).release();
  }

  async closePool(pool: DbPool): Promise<void> {
    await (pool as MysqlPool).end();
  }

  async executeTestQuery(conn: DbConnection): Promise<void> {
    await (conn as PoolConnection).execute('SELECT 1');
  }

  // 4. 操作实现方法（原DbService职责）
  async query(
    conn: DbConnection,
    sql: string,
    params?: any[],
  ): Promise<DbQueryResult> {
    const [rows, _] = await (conn as PoolConnection).execute(sql, params || []);
    return {
      rows: rows as any[],
      affectedRows: (rows as any).affectedRows,
      insertId: (rows as any).insertId,
    };
  }

  async insert(
    conn: DbConnection,
    tableName: string,
    data: Record<string, any>,
  ): Promise<DbQueryResult> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO \`${tableName}\` (${keys.map((k) => `\`${k}\``).join(',')}) VALUES (${placeholders})`;
    return this.query(conn, sql, values);
  }

  async createTable(
    conn: DbConnection,
    tableName: string,
    fields: FieldConfig[],
  ): Promise<void> {
    const fieldSqls = fields.map((f) => {
      const constraints = [
        f.notNull ? 'NOT NULL' : '',
        f.isPrimary ? 'PRIMARY KEY' : '',
      ].filter(Boolean);
      const fieldType = f.length ? `${f.dbType}(${f.length})` : f.dbType;
      return `\`${f.fieldName}\` ${fieldType} ${constraints.join(' ')} COMMENT '${f.comment || ''}'`;
    });
    const sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${fieldSqls.join(', ')})`;
    await this.query(conn, sql);
  }

  async getTableFields(
    conn: DbConnection,
    dbName: string,
    tableName: string,
  ): Promise<FieldConfig[]> {
    const sql = `
      SELECT COLUMN_NAME as name, DATA_TYPE as dbType, CHARACTER_MAXIMUM_LENGTH as length,
             (IS_NULLABLE = 'NO') as notNull, (COLUMN_KEY = 'PRI') as isPrimaryKey, COLUMN_COMMENT as comment
      FROM information_schema.columns WHERE table_schema = ? AND table_name = ?
    `;
    const { rows } = await this.query(conn, sql, [dbName, tableName]);
    return rows as FieldConfig[];
  }
}
