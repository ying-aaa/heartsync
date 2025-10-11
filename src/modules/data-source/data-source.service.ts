import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { DriverManager } from 'src/common/utils/driver-manager.util';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { Repository } from 'typeorm';

/**
 * 数据源服务：处理数据源的CRUD、连接测试、表列表查询
 */
@Injectable()
export class HsDataSourceService {
  constructor(
    // 注入数据源实体的Repository（TypeORM自动生成）
    @InjectRepository(HsDataSourceEntity)
    private dataSourceRepo: Repository<HsDataSourceEntity>,
  ) {}

  /**
   * 创建数据源（密码加密存储）
   * @param data 数据源配置（明文密码）
   * @returns 创建后的数据源实体
   */
  async create(data: Partial<HsDataSourceEntity>) {
    // 1. 加密密码
    const encryptedPwd = CryptoUtil.encrypt(data.password || '');
    // 2. 构建实体
    const dataSource = this.dataSourceRepo.create({
      ...data,
      password: encryptedPwd, // 存储加密后的密码
      status: 'offline', // 初始状态离线
    });
    // 3. 保存到元数据库
    const saved = await this.dataSourceRepo.save(dataSource);
    // 4. 自动测试连接并更新状态
    const testRes = await DriverManager.testConnection(saved);
    if (testRes.success) {
      saved.status = 'online';
      await this.dataSourceRepo.update(saved.id, { status: 'online' });
    }
    return saved;
  }

  /**
   * 获取所有数据源列表
   * @returns 数据源实体数组
   */
  async findAll() {
    return this.dataSourceRepo.find({
      order: { createdAt: 'DESC' }, // 按创建时间倒序
    });
  }

  /**
   * 根据ID获取单个数据源
   * @param id 数据源ID
   * @returns 数据源实体
   */
  async findOne(id: string) {
    const dataSource = await this.dataSourceRepo.findOneBy({ id });
    if (!dataSource) {
      throw new NotFoundException(`数据源ID=${id}不存在`);
    }
    return dataSource;
  }

  /**
   * 测试数据源连接（单独触发）
   * @param id 数据源ID
   * @returns 连接结果
   */
  async testConnection(id: string) {
    const dataSource = await this.findOne(id);
    const testRes = await DriverManager.testConnection(dataSource);
    // 同步更新数据源状态
    if (testRes.success !== (dataSource.status === 'online')) {
      await this.dataSourceRepo.update(id, {
        status: testRes.success ? 'online' : 'offline',
      });
    }
    return testRes;
  }

  /**
   * 获取数据源下的表列表
   * @param id 数据源ID
   * @returns 表列表数据
   */
  async getTableList(id: string) {
    const dataSource = await this.findOne(id);
    return DriverManager.getTableList(dataSource);
  }

  /**
   * 删除数据源
   * @param id 数据源ID
   * @returns 删除结果
   */
  async remove(id: string) {
    await this.findOne(id); // 先校验是否存在
    await this.dataSourceRepo.delete(id);
    return { success: true, message: '数据源删除成功' };
  }
}
