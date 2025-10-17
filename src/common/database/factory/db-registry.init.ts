import { DbRegistry } from './db-registry';
import { MysqlDb } from '../impl/mysql.db';
import { PostgresDb } from '../impl/postgres.db';

// 注册所有数据库（新增数据库只需加一行）
export function initDbStrategies() {
  DbRegistry.register(MysqlDb);
  DbRegistry.register(PostgresDb);
}