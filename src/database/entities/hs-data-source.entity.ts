import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('hs-data-source') // 对应元数据库中的表名
export class HsDataSourceEntity {
  @PrimaryGeneratedColumn('uuid') // 唯一ID（UUID格式）
  id: string;

  @Column({
    unique: true,
    comment: '数据源名称（用户自定义，需唯一）',
  })
  name: string;

  @Column({
    comment: '数据库类型',
    enum: ['mysql', 'postgres', 'sqlserver'], // 支持的数据库类型
    default: 'mysql',
  })
  type: string;

  @Column({ comment: '数据库主机地址（如localhost、192.168.1.100）' })
  host: string;

  @Column({ comment: '数据库端口' })
  port: number;

  @Column({ comment: '目标数据库名称（要连接的具体库名）' })
  database: string;

  @Column({ comment: '数据库登录用户名' })
  username: string;

  @Column({ comment: '加密后的数据库密码' })
  password: string;

  @Column({
    comment: '数据源连接状态',
    enum: ['online', 'offline'],
    default: 'offline', // 初始状态为离线
  })
  status: string;

  @CreateDateColumn({ comment: '数据源创建时间' })
  createdAt: Date;
}
