import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateGlobalConfigDto } from './dto/create-global-config.dto';
import { CreateMenuConfigDto } from './dto/create-menu-config.dto';
import { CreateHeaderConfigDto } from './dto/create-header-config.dto';
import { HsAppGlobalConfigEntity } from 'src/database/entities/hs-app-global-config.entity';
import { HsAppHeaderConfigEntity } from 'src/database/entities/hs-app-header-config.entity';
import { HsAppMenuConfigEntity } from 'src/database/entities/hs-app-menu-config.entity';
import { IAppConfig, IWhetherStatus } from '@heartsync/types';
import { UpdateApplicationWithConfigDto } from '../app/dto/update-application-with-config.dto';

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
    manager?: EntityManager,
  ) {
    // 1. 初始化全局配置
    const globalConfig = this.globalRepo.create({
      appId,
      versionId,
      ...configs?.globalConfig,
      isDeleted: IWhetherStatus.UNDELETED,
    });
    const savedGlobal = await (manager
      ? manager.save(globalConfig)
      : this.globalRepo.save(globalConfig));

    // 2. 初始化菜单配置
    const menuConfig = this.menuRepo.create({
      appId,
      versionId,
      ...configs?.menuConfig,
      isDeleted: IWhetherStatus.UNDELETED,
    });
    const savedMenu = await (manager
      ? manager.save(menuConfig)
      : this.menuRepo.save(menuConfig));

    // 3. 初始化头部配置
    const headerConfig = this.headerRepo.create({
      appId,
      versionId,
      ...configs?.headerConfig,
      isDeleted: IWhetherStatus.UNDELETED,
    });
    const savedHeader = await (manager
      ? manager.save(headerConfig)
      : this.headerRepo.save(headerConfig));

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
   * @param txManager 可选：事务管理器（用于事务内查询最新数据）
   */
  async getConfigsByVersion(
    appId: string,
    versionId: string,
    txManager?: EntityManager,
  ): Promise<IAppConfig> {
    const manager = txManager || this.globalRepo.manager;

    const globalConfig = await manager.findOne(HsAppGlobalConfigEntity, {
      where: { appId, versionId, isDeleted: IWhetherStatus.UNDELETED },
    });

    const menuConfig = await manager.findOne<HsAppMenuConfigEntity>(
      this.menuRepo.metadata.target,
      {
        where: { appId, versionId, isDeleted: IWhetherStatus.UNDELETED },
      },
    );

    const headerConfig = await manager.findOne<HsAppHeaderConfigEntity>(
      this.headerRepo.metadata.target,
      {
        where: { appId, versionId, isDeleted: IWhetherStatus.UNDELETED },
      },
    );

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
  // 注意：返回类型改为 getConfigsByVersion 的返回类型（需定义接口，比如 IAppAllConfig）
  async updateGlobalConfig(
    appId: string,
    versionId: string,
    dto: Omit<UpdateApplicationWithConfigDto, 'appId' | 'versionId'>,
    txManager?: EntityManager | undefined,
  ): Promise<IAppConfig> {
    // 假设 IAppAllConfig = { globalConfig, menuConfig, headerConfig }
    const updateLogic = async (manager: EntityManager) => {
      // 1. 原有更新逻辑不变
      const config = await manager.findOne(HsAppGlobalConfigEntity, {
        where: { appId, versionId, isDeleted: IWhetherStatus.UNDELETED },
      });
      if (!config) {
        throw new NotFoundException(`全局配置不存在`);
      }
      const { globalConfig, menuConfig, headerConfig } = dto;
      if (globalConfig)
        await manager.update(
          HsAppGlobalConfigEntity,
          { appId, versionId },
          globalConfig,
        );
      if (menuConfig)
        await manager.update(
          this.menuRepo.metadata.target,
          { appId, versionId },
          menuConfig,
        );
      if (headerConfig)
        await manager.update(
          this.headerRepo.metadata.target,
          { appId, versionId },
          headerConfig,
        );

      // 2. 调用 getConfigsByVersion，传递事务管理器（关键！）
      return this.getConfigsByVersion(appId, versionId, manager);
    };

    if (txManager) {
      return updateLogic(txManager);
    } else {
      return this.globalRepo.manager.transaction(async (innerTxManager) => {
        return updateLogic(innerTxManager);
      });
    }
  }
}
