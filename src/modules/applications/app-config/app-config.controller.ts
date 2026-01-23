import {
  Controller,
  Get,
  Query,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HsAppConfigService } from './app-config.service';
import { IAppConfig } from '@heartsync/types';
import { UpdateApplicationWithConfigDto } from '../app/dto/update-application-with-config.dto';

@Controller('app-configs')
export class HsAppConfigController {
  constructor(private readonly configService: HsAppConfigService) {}

  /**
   * 查询应用版本的所有配置
   */
  @Get()
  async getConfigsByVersion(
    @Query('appId') appId: string,
    @Query('versionId') versionId: string,
  ) {
    return this.configService.getConfigsByVersion(appId, versionId);
  }

  /**
   * 查询全局配置
   */
  @Get('global')
  async getGlobalConfig(
    @Query('appId') appId: string,
    @Query('versionId') versionId: string,
  ) {
    const { globalConfig } = await this.configService.getConfigsByVersion(
      appId,
      versionId,
    );
    return globalConfig;
  }

  /**
   * 更新全局配置
   */
  @Put('global')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateGlobalConfig(
    @Query('appId') appId: string,
    @Query('versionId') versionId: string,
    @Body() dto: Omit<UpdateApplicationWithConfigDto, 'appId' | 'versionId'>,
  ): Promise<IAppConfig> {
    return this.configService.updateGlobalConfig(appId, versionId, dto);
  }
}
