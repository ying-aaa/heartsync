import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HsAssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { HsAssetTableEntity } from 'src/database/entities/hs-asset-table.entity';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('asset')
export class HsAssetController {
  constructor(private readonly assetService: HsAssetService) {}

  // 创建资产
  @Post('')
  async create(@Body() assetData: CreateAssetDto) {
    return await this.assetService.create(assetData);
  }

  // 根据数据库中表字段信息生成并同步资产字段
  @Post('/:id/sync-field')
  async syncAssetFields(@Param('id') assetId: string) {
    return await this.assetService.syncAssetFields(assetId);
  }

  // 根据资产id查询资产字段
  @Get('/:id/find-field')
  async getAssetFieldsById(@Param('id') assetId: string) {
    return await this.assetService.getAssetFieldsById(assetId);
  }

  // 查询指定应用下的资产
  @Get('/app/:appId')
  async findAllByAppId(@Param('appId') appId: string) {
    return await this.assetService.findAllByAppId(appId);
  }

  /**
   * 获取所有资产
   * GET /api/data-sources
   */
  @Get()
  async findAll(
    @Query() queryAssetDto: any,
  ): Promise<PageDto<HsAssetTableEntity>> {
    return this.assetService.findAll(queryAssetDto);
  }

  // 根据资产id查询资产数据
  @Get('/:id/find')
  async findAssetDataById(@Param('id') assetId: string) {
    return await this.assetService.findAssetDataById(assetId);
  }
}
