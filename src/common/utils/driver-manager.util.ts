import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { CryptoUtil } from './crypto.util';

/**
 * 数据库驱动管理器：适配不同类型数据库的连接与查询
 */
export class DriverManager {
  /**
   * 获取数据库连接配置（解密密码）
   * @param dataSource 数据源实体
   * @returns 连接配置对象
   */
  private static getConnConfig(dataSource: HsDataSourceEntity) {
    return {
      type: dataSource.type,
      host: dataSource.host,
      port: dataSource.port,
      database: dataSource.database,
      username: dataSource.username,
      password: CryptoUtil.decrypt(dataSource.password), // 解密密码
    };
  }

  /**
   * 测试数据源连接
   * @param dataSource 数据源实体
   * @returns 连接结果（成功/失败+消息）
   */
  static async testConnection(dataSource: HsDataSourceEntity) {
    const config = this.getConnConfig(dataSource);
    let connection: any = null;
    const { host, port, database, username: user, password } = config;

    try {
      // 动态加载对应数据库驱动（避免打包冗余依赖）
      let driver: any;
      if (config.type === 'mysql') {
        driver = await import('mysql2/promise');
        // 创建MySQL连接并测试
        connection = await driver.createConnection({
          host,
          port,
          user,
          password,
          database,
        });
        await connection.query('SELECT 1'); // 测试查询
      } else if (config.type === 'postgres') {
        driver = await import('pg');
        // 创建PostgreSQL连接并测试
        connection = new driver.Client({
          host,
          port,
          user,
          password,
          database,
        });
        await connection.connect();
        await connection.query('SELECT 1');
      } else {
        return { success: false, message: `暂不支持${config.type}类型数据库` };
      }

      return { success: true, message: '连接成功' };
    } catch (error: any) {
      return {
        success: false,
        message: `连接失败：${error.message || '未知错误'}`,
      };
    } finally {
      // 关闭连接（避免资源泄漏）
      if (connection) {
        config.type === 'mysql'
          ? await connection.end()
          : await connection.end();
      }
    }
  }

  /**
   * 获取数据源下的表列表
   * @param dataSource 数据源实体
   * @returns 表名数组
   */
  static async getTableList(dataSource: HsDataSourceEntity) {
    const config = this.getConnConfig(dataSource);
    let connection: any = null;

    try {
      let tableList: string[] = [];
      if (config.type === 'mysql') {
        const driver = await import('mysql2/promise');
        connection = await driver.createConnection(config);
        // 查询MySQL表列表（从information_schema获取）
        const [rows] = await connection.query(
          `SELECT table_name FROM information_schema.tables 
           WHERE table_schema = ? AND table_type = 'BASE TABLE'`,
          [config.database],
        );
        tableList = (rows as any[]).map((row) => row.table_name);
      } else if (config.type === 'postgres') {
        const driver = await import('pg');
        connection = new driver.Client(config);
        await connection.connect();
        // 查询PostgreSQL表列表（过滤系统表）
        const res = await connection.query(
          `SELECT table_name FROM information_schema.tables 
           WHERE table_catalog = $1 AND table_schema = 'public'`,
          [config.database],
        );
        tableList = res.rows.map((row) => row.table_name);
      }

      return { success: true, data: tableList };
    } catch (error: any) {
      return {
        success: false,
        message: `获取表列表失败：${error.message}`,
      };
    } finally {
      if (connection) {
        config.type === 'mysql'
          ? await connection.end()
          : await connection.disconnect();
      }
    }
  }
}
