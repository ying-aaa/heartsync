import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppConfigTemplateService } from './app-config-template.service';
import { CreateAppConfigTemplateDto } from './dto/create-app-config-template.dto';
import { UpdateAppConfigTemplateDto } from './dto/update-app-config-template.dto';
import { HsAppConfigTemplate } from 'src/database/entities/hs-app-config-template.entity';
/**
 * 应用配置模板控制器
 * 暴露RESTful API接口，处理HTTP请求
 */
@Controller('app-template')
export class AppConfigTemplateController {
  constructor(private readonly templateService: AppConfigTemplateService) {}

  /**
   * 创建配置模板
   * POST /app-template
   */
  @Post()
  create(
    @Body() createDto: CreateAppConfigTemplateDto,
  ): Promise<HsAppConfigTemplate> {
    return this.templateService.create(createDto);
  }

  /**
   * 查询模板列表
   * GET /app-template
   * 支持参数：appId、templateType、creatorId
   */
  @Get()
  findAll(
    @Query('appId') appId?: string,
    @Query('templateType') templateType?: string,
    @Query('creatorId') creatorId?: string,
  ): Promise<HsAppConfigTemplate[]> {
    return this.templateService.findAll({ appId, templateType, creatorId });
  }

  /**
   * 查询单个模板
   * GET /app-template/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<HsAppConfigTemplate> {
    return this.templateService.findOne(id);
  }

  /**
   * 查询应用默认模板
   * GET /app-template/default/:appId
   */
  @Get('default/:appId')
  findDefaultTemplate(
    @Param('appId') appId: string,
  ): Promise<HsAppConfigTemplate | null> {
    return this.templateService.findDefaultTemplate(appId);
  }

  /**
   * 更新模板
   * PATCH /app-template
   */
  @Patch()
  update(
    @Body() updateDto: UpdateAppConfigTemplateDto,
  ): Promise<HsAppConfigTemplate> {
    return this.templateService.update(updateDto);
  }

  /**
   * 删除模板
   * DELETE /app-template/:id
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.templateService.remove(id);
  }
}
