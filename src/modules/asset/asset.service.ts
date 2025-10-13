import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsAssetFieldEntity } from 'src/database/entities/hs-asset-field.entity';
import { Repository } from 'typeorm';
import { HsAssetSyncService } from './asset-sync.service';
import { HsAssetTableEntity } from 'src/database/entities/hs-asset-table.entity';
import { CreateAssetDto } from './dto/create-asset.dto';

/**
 * 根据前端传入的参数，生成数据库表结构
 * 传递：
 * 1、几张表，每张表的表名 建立内部维护（考虑已有表里加入）
 * 2、关联关系 内部维护
 * 2、表对应关系 建立内部维护
 * 3、每张表字段 字段可以被多个表单或列表所使用
 */

@Injectable()
export class HsAssetService {
  constructor(
    @InjectRepository(HsAssetTableEntity)
    private assetTableRepo: Repository<HsAssetTableEntity>,
    @InjectRepository(HsAssetFieldEntity)
    private assetFieldRepo: Repository<HsAssetFieldEntity>,
    private hsAssetSyncService: HsAssetSyncService,
  ) {}

  async create(assetData: CreateAssetDto) {
    try {
      const newData = this.assetTableRepo.create(assetData);
      const result = await this.assetTableRepo.save(newData);
      return result;
    } catch (e) {
      throw new BadRequestException(e.detail);
    }
  }

  async syncAssetFields(assetId: string) {
    let assetData: HsAssetTableEntity;
    try {
      // 查询资产数据
      assetData = await this.assetTableRepo.findOneBy({ id: assetId });
    } catch (error) {
      throw new NotFoundException(`资产ID=${assetId}不存在`);
    }
    const { dataSourceId, tableName } = assetData;
    // 根据资产id查询
    return await this.hsAssetSyncService.syncTableFields(
      dataSourceId,
      tableName,
      assetId,
    );
  }

  async getAssetFieldsById(assetId: string) {
    return this.assetFieldRepo.find({
      where: { id: assetId },
    });
  }
}
