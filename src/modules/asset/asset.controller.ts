import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HsAssetService } from './asset.service';
import { SyncFieldDto } from './dto/sync-field.dto';

@Controller('asset')
export class HsAssetController {
  constructor(private readonly assetService: HsAssetService) {}

  // 根据数据库中表字段信息生成并同步资产字段
  @Post('/sync-field')
  async syncAssetFields(@Body() syncInfo: SyncFieldDto) {
    const { dataSourceId, tableName } = syncInfo;
    return await this.assetService.syncAssetFields(dataSourceId, tableName);
  }

  // 查询指定资产下的字段
  @Get('/find-field/:id')
  async getAssetFieldsById(@Param('id') assetId: string) {
    return await this.assetService.getAssetFieldsById(assetId);
  }
}
