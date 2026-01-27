import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsAppConfigTemplate } from 'src/database/entities/hs-app-config-template.entity';
import { CreateAppConfigTemplateDto } from './dto/create-app-config-template.dto';
import { UpdateAppConfigTemplateDto } from './dto/update-app-config-template.dto';

/**
 * 应用配置模板CRUD服务
 * 封装数据库操作逻辑，对外提供简洁的调用接口
 */
@Injectable()
export class AppConfigTemplateService {
  constructor(
    @InjectRepository(HsAppConfigTemplate)
    private readonly templateRepository: Repository<HsAppConfigTemplate>,
  ) {}

  /**
   * 创建配置模板
   * @param dto 创建模板参数
   * @returns 创建后的模板信息
   */
  async create(dto: CreateAppConfigTemplateDto): Promise<HsAppConfigTemplate> {
    try {
      // 转换JSON字符串为对象（前端传JSON字符串时）
      const template = new HsAppConfigTemplate();
      template.templateName = dto.templateName;
      template.templateType = dto.templateType || 'system';
      template.appId = dto.appId;
      template.creatorId = dto.creatorId;
      template.isDefault = dto.isDefault || 0;
      template.remark = dto.remark;

      // 处理JSON配置字段
      template.appGlobalConfig = dto.appGlobalConfig
        ? JSON.parse(dto.appGlobalConfig)
        : {};
      template.appHeaderConfig = dto.appHeaderConfig
        ? JSON.parse(dto.appHeaderConfig)
        : {};
      template.appMenuConfig = dto.appMenuConfig
        ? JSON.parse(dto.appMenuConfig)
        : {};

      return await this.templateRepository.save(template);
    } catch (error) {
      throw new BadRequestException(`创建模板失败：${error.message}`);
    }
  }

  /**
   * 查询模板列表（支持条件筛选）
   * @param query 筛选条件
   * @returns 模板列表
   */
  async findAll(query?: {
    appId?: string;
    templateType?: string;
    creatorId?: string;
  }): Promise<HsAppConfigTemplate[]> {
    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    // 条件筛选
    if (query?.appId) {
      queryBuilder.andWhere('template.appId = :appId', { appId: query.appId });
    }
    if (query?.templateType) {
      queryBuilder.andWhere('template.templateType = :templateType', {
        templateType: query.templateType,
      });
    }
    if (query?.creatorId) {
      queryBuilder.andWhere('template.creatorId = :creatorId', {
        creatorId: query.creatorId,
      });
    }

    // 按创建时间倒序
    queryBuilder.orderBy('template.createTime', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * 根据ID查询单个模板
   * @param id 模板ID
   * @returns 模板详情
   */
  async findOne(id: string): Promise<HsAppConfigTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`模板ID ${id} 不存在`);
    }
    return template;
  }

  /**
   * 更新模板
   * @param dto 更新模板参数
   * @returns 更新后的模板信息
   */
  async update(dto: UpdateAppConfigTemplateDto): Promise<HsAppConfigTemplate> {
    // 先校验模板是否存在
    const template = await this.findOne(dto.id);

    try {
      // 覆盖更新字段
      if (dto.templateName) template.templateName = dto.templateName;
      if (dto.templateType) template.templateType = dto.templateType;
      if (dto.appId !== undefined) template.appId = dto.appId;
      if (dto.isDefault !== undefined) template.isDefault = dto.isDefault;
      if (dto.remark) template.remark = dto.remark;

      // 处理JSON配置更新
      if (dto.appGlobalConfig) {
        template.appGlobalConfig = JSON.parse(dto.appGlobalConfig);
      }
      if (dto.appHeaderConfig) {
        template.appHeaderConfig = JSON.parse(dto.appHeaderConfig);
      }
      if (dto.appMenuConfig) {
        template.appMenuConfig = JSON.parse(dto.appMenuConfig);
      }

      return await this.templateRepository.save(template);
    } catch (error) {
      throw new BadRequestException(`更新模板失败：${error.message}`);
    }
  }

  /**
   * 删除模板（物理删除，如需软删可添加isDeleted字段）
   * @param id 模板ID
   * @returns 删除结果
   */
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    // 先校验模板是否存在
    await this.findOne(id);

    try {
      await this.templateRepository.delete(id);
      return {
        success: true,
        message: `模板ID ${id} 删除成功`,
      };
    } catch (error) {
      throw new BadRequestException(`删除模板失败：${error.message}`);
    }
  }

  /**
   * 查询应用默认模板
   * @param appId 应用ID
   * @returns 默认模板
   */
  async findDefaultTemplate(
    appId: string,
  ): Promise<HsAppConfigTemplate | null> {
    return await this.templateRepository.findOne({
      where: { appId, isDefault: 1 },
    });
  }
}
