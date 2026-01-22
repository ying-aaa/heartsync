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
import { QueryAppVersionDto } from './dto/query-app-version.dto';
import { PageDto } from 'src/common/dtos/page.dto';

@Controller('app-versions')
export class HsAppVersionController {
  constructor(private readonly versionService: HsAppVersionService) {}

  /**
   * 查询应用所有版本
   */
  @Get('all')
  async findAll(
    @Query() queryDto: QueryAppVersionDto,
  ): Promise<PageDto<HsAppVersionEntity>> {
    return this.versionService.findAll(queryDto);
  }

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
  @Get('latest/:appId')
  async findLatest(@Param('appId') appId: string): Promise<HsAppVersionEntity> {
    return this.versionService.findLatestVersion(appId);
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
