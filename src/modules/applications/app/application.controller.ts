import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HsApplicationService } from './application.service';
import { CreateApplicationWithConfigDto } from './dto/create-application-with-config.dto';
import { UpdateApplicationWithConfigDto } from './dto/update-application-with-config.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { RoleMatchingMode, Roles, Unprotected } from 'nest-keycloak-connect';
import { PageDto } from 'src/common/dtos/page.dto';
import { HsApplicationEntity } from 'src/database/entities/hs-application.entity';
import { IAppWithConfig } from '@heartsync/types';

@Controller('applications')
export class HsApplicationController {
  constructor(private readonly appService: HsApplicationService) {}

  /**
   * 创建应用+版本+配置（整合接口）
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() dto: CreateApplicationWithConfigDto,
  ): Promise<IAppWithConfig> {
    return this.appService.createWithConfig(dto);
  }

  /**
   * 分页查询应用列表（含配置）
   */
  @Get()
  @Roles({ roles: ['super-admin'], mode: RoleMatchingMode.ALL })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(
    @Query() queryDto: QueryApplicationDto,
  ): Promise<PageDto<IAppWithConfig>> {
    return this.appService.findAll(queryDto);
  }

  /**
   * 检查目录下是否有应用数据
   */
  @Get('check-data')
  @Unprotected()
  async checkData(@Query('directoryId') directoryId: string) {
    if (!directoryId || typeof directoryId !== 'string') {
      throw new BadRequestException('directoryId是必需的，并且必须是字符串');
    }
    const hasData = await this.appService.hasData({ directoryId });
    return { hasData };
  }

  /**
   * 查询单个应用+配置
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('versionId') versionId?: string,
  ): Promise<IAppWithConfig> {
    return this.appService.findOneWithConfig(id, versionId);
  }

  /**
   * 更新应用+配置
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationWithConfigDto,
  ): Promise<IAppWithConfig> {
    return this.appService.updateWithConfig(id, dto);
  }

  /**
   * 软删除应用
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.appService.remove(id);
  }
}
