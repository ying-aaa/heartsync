import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('hs_data_source') // 对应元数据库中的表名
@Unique(['appId', 'name', 'type'])
export class HsDataSourceEntity {
  @PrimaryGeneratedColumn('uuid') // 唯一ID（UUID格式）
  id: string;

  @Column({
    name: 'app_id',
    type: 'varchar',
    nullable: true,
    length: 100,
    default: 'system',
    comment: '应用ID',
  })
  appId?: string;

  @Column({
    type: 'varchar',
    comment: '数据源名称（用户自定义，需唯一）',
  })
  name: string;

  @Column({
    comment: '数据库类型',
    type: 'varchar',
    enum: ['mysql', 'postgres', 'sqlserver'], // 支持的数据库类型
    default: 'mysql',
  })
  type: string;

  @Column({
    type: 'varchar',
    comment: '数据库主机地址（如localhost、192.168.1.100）',
  })
  host: string;

  @Column({ type: 'int', comment: '数据库端口' })
  port: number;

  @Column({ type: 'varchar', comment: '目标数据库名称（要连接的具体库名）' })
  database: string;

  @Column({ type: 'varchar', comment: '数据库登录用户名' })
  username: string;

  @Column({ type: 'varchar', comment: '加密后的数据库密码' })
  password: string;

  // 客户端字符集
  @Column({
    type: 'varchar',
    name: 'client_charset',
    comment: '客户端字符集',
    default: 'utf8',
  })
  clientCharset: string;
  // 服务器字符集
  @Column({
    type: 'varchar',
    name: 'data_base_charset',
    comment: '服务器字符集',
    default: 'al32utf8',
  })
  dataBaseCharset: string;

  // 连接池最大连接数
  @Column({
    type: 'int',
    name: 'max_pool_count',
    comment: '连接池最大连接数',
    default: 50,
  })
  maxPoolCount: number;

  @Column({
    type: 'int',
    name: 'min_pool_count',
    comment: '连接池最小连接数',
    default: 10,
  })
  minPoolCount: number;

  @Column({
    type: 'varchar',
    comment: '数据源连接状态',
    enum: ['online', 'offline'],
    default: 'offline', // 初始状态为离线
  })
  status: string;

  @CreateDateColumn({ name: 'created_at', comment: '数据源创建时间' })
  createdAt: Date;
}
