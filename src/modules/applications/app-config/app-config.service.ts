import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGlobalConfigDto } from './dto/create-global-config.dto';
import { CreateMenuConfigDto } from './dto/create-menu-config.dto';
import { CreateHeaderConfigDto } from './dto/create-header-config.dto';
import { HsAppGlobalConfigEntity } from 'src/database/entities/hs-app-global-config.entity';
import { HsAppHeaderConfigEntity } from 'src/database/entities/hs-app-header-config.entity';
import { HsAppMenuConfigEntity } from 'src/database/entities/hs-app-menu-config.entity';
import { ISoftDeleteStatus } from '@heartsync/types';

@Injectable()
export class HsAppConfigService {
  constructor(
    @InjectRepository(HsAppGlobalConfigEntity)
    private readonly globalRepo: Repository<HsAppGlobalConfigEntity>,
    @InjectRepository(HsAppMenuConfigEntity)
    private readonly menuRepo: Repository<HsAppMenuConfigEntity>,
    @InjectRepository(HsAppHeaderConfigEntity)
    private readonly headerRepo: Repository<HsAppHeaderConfigEntity>,
  ) {}

  /**
   * 批量初始化配置（供应用服务调用）
   * @param appId 应用ID
   * @param versionId 版本ID
   * @param configs 配置参数
   */
  async initConfigs(
    appId: string,
    versionId: string,
    configs?: {
      globalConfig?: Omit<CreateGlobalConfigDto, 'appId' | 'versionId'>;
      menuConfig?: Omit<CreateMenuConfigDto, 'appId' | 'versionId'>;
      headerConfig?: Omit<CreateHeaderConfigDto, 'appId' | 'versionId'>;
    },
  ) {
    // 1. 初始化全局配置
    const globalConfig = this.globalRepo.create({
      appId,
      versionId,
      ...configs?.globalConfig,
      isDeleted: ISoftDeleteStatus.UNDELETED,
    });
    const savedGlobal = await this.globalRepo.save(globalConfig);

    // 2. 初始化菜单配置
    const menuConfig = this.menuRepo.create({
      appId,
      versionId,
      ...configs?.menuConfig,
      isDeleted: ISoftDeleteStatus.UNDELETED,
    });
    const savedMenu = await this.menuRepo.save(menuConfig);

    // 3. 初始化头部配置
    const headerConfig = this.headerRepo.create({
      appId,
      versionId,
      ...configs?.headerConfig,
      isDeleted: ISoftDeleteStatus.UNDELETED,
    });
    const savedHeader = await this.headerRepo.save(headerConfig);

    return {
      globalConfig: savedGlobal,
      menuConfig: savedMenu,
      headerConfig: savedHeader,
    };
  }

  /**
   * 查询应用版本的配置
   * @param appId 应用ID
   * @param versionId 版本ID
   */
  async getConfigsByVersion(appId: string, versionId: string) {
    // 查询全局配置
    const globalConfig = await this.globalRepo.findOne({
      where: { appId, versionId, isDeleted: ISoftDeleteStatus.UNDELETED },
    });

    // 查询菜单配置
    const menuConfig = await this.menuRepo.findOne({
      where: { appId, versionId, isDeleted: ISoftDeleteStatus.UNDELETED },
    });

    // 查询头部配置
    const headerConfig = await this.headerRepo.findOne({
      where: { appId, versionId, isDeleted: ISoftDeleteStatus.UNDELETED },
    });

    // 校验配置完整性
    if (!globalConfig || !menuConfig || !headerConfig) {
      throw new NotFoundException(`应用${appId}版本${versionId}的配置不完整`);
    }

    return { globalConfig, menuConfig, headerConfig };
  }

  /**
   * 更新全局配置
   * @param appId 应用ID
   * @param versionId 版本ID
   * @param dto 配置更新参数
   */
  async updateGlobalConfig(
    appId: string,
    versionId: string,
    dto: Omit<CreateGlobalConfigDto, 'appId' | 'versionId'>,
  ): Promise<HsAppGlobalConfigEntity> {
    // 校验配置是否存在
    const config = await this.globalRepo.findOne({
      where: { appId, versionId, isDeleted: ISoftDeleteStatus.UNDELETED },
    });
    if (!config) {
      throw new NotFoundException(`全局配置不存在`);
    }

    // 更新配置
    await this.globalRepo.update({ appId, versionId }, dto);
    return this.globalRepo.findOne({ where: { appId, versionId } });
  }
}
