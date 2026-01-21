import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { HsAppVersionService } from './app-version.service';
import { HsAppVersionEntity } from 'src/database/entities/hs-app-version.entity';
import { CreateAppVersionDto } from './dto/create-app-version.dto';

@Controller('app-versions')
export class HsAppVersionController {
  constructor(private readonly versionService: HsAppVersionService) {}

  /**
   * 创建版本（独立接口）
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateAppVersionDto): Promise<HsAppVersionEntity> {
    return this.versionService.create(dto);
  }

  /**
   * 查询版本详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HsAppVersionEntity> {
    return this.versionService.findOne(id);
  }

  /**
   * 查询应用最新版本
   */
  @Get('latest/:applicationId')
  async findLatest(
    @Param('applicationId') applicationId: string,
  ): Promise<HsAppVersionEntity> {
    return this.versionService.findLatestVersion(applicationId);
  }

  /**
   * 发布版本
   */
  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    @Query('publishUserId') publishUserId: string,
  ): Promise<HsAppVersionEntity> {
    return this.versionService.publish(id, publishUserId);
  }
}
