// 通用类型（可抽离到types/db.types.ts）
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  maxPoolCount?: number;
  minPoolCount?: number;
}
export type DbPool = any;       // 具体数据库的连接池类型
export type DbConnection = any; // 具体数据库的连接类型
export interface DbQueryResult { // 统一查询结果
  rows: any[];
  affectedRows?: number;
  insertId?: number;
}
export interface FieldConfig {   // 字段配置（建表/查字段用）
  name: string;
  dbType: string;
  notNull?: boolean;
  isPrimaryKey?: boolean;
  comment?: string;
  length?: number;
}

/**
 * 统一数据库策略接口：整合连接管理和操作实现
 */
export interface UnifiedDbStrategy {
  // 1. 基础标识
  type: string; // 数据库类型（如'mysql'、'postgres'）

  // 2. 连接管理方法（原Strategy职责）
  testConnection(config: DbConfig): Promise<{ success: boolean; message: string }>;
  createPool(config: DbConfig): Promise<DbPool>;
  getConnection(pool: DbPool): Promise<DbConnection>;
  releaseConnection(conn: DbConnection): Promise<void>;
  closePool(pool: DbPool): Promise<void>;
  executeTestQuery(conn: DbConnection): Promise<void>;

  // 3. 操作实现方法（原DbService职责）
  query(conn: DbConnection, sql: string, params?: any[]): Promise<DbQueryResult>;
  insert(conn: DbConnection, tableName: string, data: Record<string, any>): Promise<DbQueryResult>;
  createTable(conn: DbConnection, tableName: string, fields: FieldConfig[]): Promise<void>;
  getTableFields(conn: DbConnection, dbName: string, tableName: string): Promise<FieldConfig[]>;
}