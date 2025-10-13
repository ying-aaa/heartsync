import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HsAssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('asset')
export class HsAssetController {
  constructor(private readonly assetService: HsAssetService) {}

  // 创建资产
  @Post('')
  async create(@Body() assetData: CreateAssetDto) {
    return await this.assetService.create(assetData);
  }

  // 根据数据库中表字段信息生成并同步资产字段
  @Post('/sync-field/:assetId')
  async syncAssetFields(@Param('assetId') assetId: string) {
    return await this.assetService.syncAssetFields(assetId);
  }

  // 查询指定资产下的字段
  @Get('/find-field/:id')
  async getAssetFieldsById(@Param('id') assetId: string) {
    return await this.assetService.getAssetFieldsById(assetId);
  }
}
