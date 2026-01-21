// src/modules/application/application.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateApplicationWithConfigDto } from './dto/create-application-with-config.dto';
import { UpdateApplicationWithConfigDto } from './dto/update-application-with-config.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { HsAppVersionService } from '../app-version/app-version.service';
import { HsAppConfigService } from '../app-config/app-config.service';
import { ISoftDeleteStatus } from '@heartsync/types';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsApplicationEntity } from 'src/database/entities/hs-application.entity';
import { PageDto } from 'src/common/dtos/page.dto';

/** 应用+配置整合返回类型 */
export type ApplicationWithConfig = {
  application: HsApplicationEntity;
  version: any;
  globalConfig: any;
  menuConfig: any;
  headerConfig: any;
};

@Injectable()
export class HsApplicationService {
  constructor(
    @InjectRepository(HsApplicationEntity)
    private readonly appRepo: Repository<HsApplicationEntity>,
    private readonly dataSource: DataSource, // 事务管理
    @Inject(forwardRef(() => HsAppVersionService))
    private readonly versionService: HsAppVersionService,
    private readonly configService: HsAppConfigService,
    private readonly paginationService: HsPaginationService,
  ) {}

  /**
   * 创建应用+版本+配置（整合接口，事务保障）
   */
  async createWithConfig(
    dto: CreateApplicationWithConfigDto,
  ): Promise<ApplicationWithConfig> {
    // 开启数据库事务：确保应用、版本、配置原子性创建
    return this.dataSource.transaction(async (manager) => {
      const application = manager.create(HsApplicationEntity, {
        name: dto.name,
        description: dto.description,
        directoryId: dto.directoryId,
        isDeleted: ISoftDeleteStatus.UNDELETED,
      });
      const savedApp = await manager.save(application);

      // 3. 创建初始版本（调用版本服务）
      const version = await this.versionService.create({
        applicationId: savedApp.id,
        versionCode: dto.versionCode,
        versionName: dto.versionName,
      });

      // 4. 初始化配置（调用配置服务）
      const { globalConfig, menuConfig, headerConfig } =
        await this.configService.initConfigs(savedApp.id, version.id, {
          globalConfig: dto.globalConfig,
          menuConfig: dto.menuConfig,
          headerConfig: dto.headerConfig,
        });

      // 5. 返回整合数据
      return {
        application: savedApp,
        version,
        globalConfig,
        menuConfig,
        headerConfig,
      };
    });
  }

  /**
   * 分页查询应用列表
   */
  async findAll(
    queryDto: QueryApplicationDto,
  ): Promise<PageDto<ApplicationWithConfig>> {
    const pageResult = await this.paginationService.paginate(this.appRepo, {
      ...queryDto,
      isDeleted: ISoftDeleteStatus.UNDELETED,
    } as QueryApplicationDto);

    // return pageResult;

    // 3. 为每个应用关联配置
    const itemsWithConfig: ApplicationWithConfig[] = await Promise.all(
      pageResult.data.map(async (app) => {
        return this.getApplicationWithConfig(app.id, queryDto.versionId);
      }),
    );

    return {
      ...pageResult,
      data: itemsWithConfig,
    };
  }

  /**
   * 查询单个应用+配置
   */
  async findOneWithConfig(
    appId: string,
    versionId?: string,
  ): Promise<ApplicationWithConfig> {
    // 1. 校验应用是否存在
    const application = await this.findOne(appId);

    // 2. 确定目标版本
    const targetVersion = versionId
      ? await this.versionService.findOne(versionId)
      : await this.versionService.findLatestVersion(appId);

    // 3. 查询配置
    const { globalConfig, menuConfig, headerConfig } =
      await this.configService.getConfigsByVersion(appId, targetVersion.id);

    return {
      application,
      version: targetVersion,
      globalConfig,
      menuConfig,
      headerConfig,
    };
  }

  /**
   * 更新应用+配置
   */
  async updateWithConfig(
    appId: string,
    dto: UpdateApplicationWithConfigDto,
  ): Promise<ApplicationWithConfig> {
    // 1. 校验应用是否存在
    await this.findOne(appId);

    await this.appRepo.update(appId, {
      name: dto.name,
      description: dto.description,
      directoryId: dto.directoryId,
    });

    // 3. 更新配置（指定版本）
    if (dto.versionId) {
      // 校验版本归属
      const version = await this.versionService.findOne(dto.versionId);
      if (version.applicationId !== appId) {
        throw new BadRequestException(`版本${dto.versionId}不属于应用${appId}`);
      }

      // 更新全局配置
      if (dto.globalConfig) {
        await this.configService.updateGlobalConfig(
          appId,
          dto.versionId,
          dto.globalConfig,
        );
      }

      // 可扩展：更新菜单/头部配置
    }

    // 4. 返回更新后的完整数据
    return this.getApplicationWithConfig(appId, dto.versionId);
  }

  /**
   * 软删除应用
   */
  async remove(appId: string): Promise<void> {
    // 1. 校验应用是否存在
    const app = await this.findOne(appId);

    if (app.isDeleted === ISoftDeleteStatus.DELETED) {
      throw new BadRequestException(`应用${appId}已删除`);
    }

    // 2. 软删除应用
    await this.appRepo.update(appId, { isDeleted: ISoftDeleteStatus.DELETED });

    // 3. 可选：软删除关联配置
    // （根据业务需求选择是否级联删除，此处仅为示例）
  }

  /**
   * 检查目录下是否有应用数据
   */
  async hasData(condition: { directoryId: string }): Promise<boolean> {
    const count = await this.appRepo.count({
      where: { ...condition, isDeleted: ISoftDeleteStatus.UNDELETED },
    });
    return count > 0;
  }

  /**
   * 查询应用基础信息（内部复用）
   */
  async findOne(appId: string): Promise<HsApplicationEntity> {
    const app = await this.appRepo.findOne({
      where: { id: appId, isDeleted: ISoftDeleteStatus.UNDELETED },
    });
    if (!app) {
      throw new NotFoundException(`应用ID${appId}不存在或已删除`);
    }
    return app;
  }

  /**
   * 获取应用+配置（核心复用方法）
   */
  private async getApplicationWithConfig(
    appId: string,
    versionId?: string,
  ): Promise<ApplicationWithConfig> {
    // 1. 查询应用基础信息
    const application = await this.findOne(appId);

    // 2. 确定版本
    const targetVersion = versionId
      ? await this.versionService.findOne(versionId)
      : await this.versionService.findLatestVersion(appId);

    // 3. 查询配置
    const { globalConfig, menuConfig, headerConfig } =
      await this.configService.getConfigsByVersion(appId, targetVersion.id);

    return {
      application,
      version: targetVersion,
      globalConfig,
      menuConfig,
      headerConfig,
    };
  }
}
