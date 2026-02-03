import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateApplicationWithConfigDto } from './dto/create-application-with-config.dto';
import { UpdateApplicationWithConfigDto } from './dto/update-application-with-config.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { HsAppVersionService } from '../app-version/app-version.service';
import { HsAppConfigService } from '../app-config/app-config.service';
import { IAppData, IAppWithConfig, IWhetherStatus } from '@heartsync/types';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsApplicationEntity } from 'src/database/entities/hs-application.entity';
import { PageDto } from 'src/common/dtos/page.dto';
import { IAppVersionStatus } from '@heartsync/types';
import { HsAppVersionEntity } from 'src/database/entities/hs-app-version.entity';
@Injectable()
export class HsApplicationService {
  constructor(
    @InjectRepository(HsApplicationEntity)
    private readonly appRepo: Repository<HsApplicationEntity>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => HsAppVersionService))
    private versionService: HsAppVersionService,
    private readonly configService: HsAppConfigService,
    private readonly paginationService: HsPaginationService,
  ) {}

  /**
   * 创建应用+版本+配置
   */
  async createWithConfig(
    dto: CreateApplicationWithConfigDto,
  ): Promise<IAppWithConfig> {
    return this.dataSource.transaction(async (manager) => {
      if (!dto.imageUrl || !dto.imageUrl.length) {
        dto.imageUrl = [
          {
            name: 'app.png',
            url: '/assets/workbench/app.png',
          },
        ];
      }
      const application = await manager.create(HsApplicationEntity, {
        ...dto,
        isDeleted: IWhetherStatus.NO,
      });
      const savedApp = await manager.save(application);

      // 创建初始版本（调用版本服务）
      const version = await this.versionService.create(
        {
          appId: savedApp.id,
          versionCode: dto.versionCode || '初始版本',
          versionName: dto.versionName,
        },
        manager,
      );

      // 初始化配置（调用配置服务）
      const { globalConfig, menuConfig, headerConfig } =
        await this.configService.initConfigs(
          savedApp.id,
          version.id,
          {
            globalConfig: dto.globalConfig,
            menuConfig: dto.menuConfig,
            headerConfig: dto.headerConfig,
          },
          manager,
        );

      // 整合数据
      return {
        ...savedApp,
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
  ): Promise<PageDto<IAppWithConfig>> {
    const { versionCode, versionStatus, isPublished } = queryDto;

    const queryBuilder = this.appRepo.createQueryBuilder('app');

    queryBuilder.leftJoinAndSelect('app.versions', 'version');

    // 如果有指定版本ID，只查询该版本的应用
    if (versionCode) {
      queryBuilder.andWhere('version.version_code = :versionCode', {
        versionCode,
      });
    } else {
      // 如果没有，则查询最新版本，优先查询 publishTime 的最新值，如果没有，则查询createTime的最新值
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('v2.id')
          .from(HsAppVersionEntity, 'v2')
          .where('v2.app_id = app.id')
          .orderBy('v2.publish_time', 'DESC', 'NULLS LAST')
          .addOrderBy('v2.create_time', 'DESC')
          .limit(1)
          .getQuery();

        return 'version.id = ' + subQuery;
      });
    }

    if (versionStatus !== undefined) {
      queryBuilder.andWhere('version.status = :versionStatus', {
        versionStatus,
      });
    }

    if (isPublished) {
      queryBuilder.andWhere('version.status = :versionStatus', {
        versionStatus: IAppVersionStatus.PUBLISHED,
      });
    }

    Reflect.deleteProperty(queryDto, 'versionId');
    Reflect.deleteProperty(queryDto, 'versionStatus');
    Reflect.deleteProperty(queryDto, 'isPublished');

    const pageResult = await this.paginationService.paginate(
      queryBuilder,
      queryDto,
      'app',
    );

    return pageResult as any;

    return;

    // const pageResult = await this.paginationService.paginate(this.appRepo, {
    //   ...queryDto,
    //   isDeleted: IWhetherStatus.NO,
    // } as QueryApplicationDto);

    // // return pageResult;

    // // 3. 为每个应用关联配置
    // const itemsWithConfig: IAppWithConfig[] = await Promise.all(
    //   pageResult.data.map(async (app) => {
    //     const targetVersion = queryDto.versionId
    //       ? await this.versionService.findOne(queryDto.versionId)
    //       : await this.versionService.findLatestVersion(app.id);
    //     return {
    //       ...app,
    //       version: targetVersion,
    //     } as unknown as IAppWithConfig;
    //     // return this.getApplicationWithConfig(app.id, queryDto.versionId);
    //   }),
    // );

    // return {
    //   ...pageResult,
    //   data: itemsWithConfig,
    // };
  }

  /**
   * 查询单个应用+配置
   */
  async findOneWithConfig(
    appId: string,
    versionId?: string,
  ): Promise<IAppWithConfig> {
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
      ...application,
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
  ): Promise<IAppWithConfig> {
    // 外部事务入口
    return this.appRepo.manager.transaction(
      async (txManager: EntityManager) => {
        // 更新应用基础信息
        await txManager.update(this.appRepo.metadata.target, appId, {
          name: dto.name,
          description: dto.description,
          directoryId: dto.directoryId,
        });

        const application = await txManager.findOne<IAppData>(
          this.appRepo.metadata.target,
          { where: { id: appId } },
        );

        let targetVersion: HsAppVersionEntity;

        if (dto.versionId) {
          targetVersion = await txManager.findOne<HsAppVersionEntity>(
            HsAppVersionEntity,
            { where: { id: dto.versionId } },
          );

          if (!targetVersion) {
            throw new BadRequestException(`版本${dto.versionId}不存在`);
          }
          if (targetVersion.appId !== appId) {
            throw new BadRequestException(
              `版本${dto.versionId}不属于应用${appId}`,
            );
          }
        } else {
          targetVersion = await this.versionService.findLatestVersion(appId);
        }

        // 更新全局配置：传递外部事务的 txManager
        const appConfig = await this.configService.updateGlobalConfig(
          appId,
          targetVersion.id,
          dto,
          txManager, // 外部事务管理器
        );

        return {
          ...application,
          version: targetVersion,
          ...appConfig,
        };
      },
    );
  }

  /**
   * 软删除应用
   */
  async remove(appId: string): Promise<void> {
    const app = await this.findOne(appId);

    if (app.isDeleted === IWhetherStatus.YES) {
      throw new BadRequestException(`应用${appId}已删除`);
    }

    await this.appRepo.update(appId, { isDeleted: IWhetherStatus.YES });

    // （根据业务需求选择是否级联删除）
  }

  /**
   * 检查目录下是否有应用数据
   */
  async hasData(condition: { directoryId: string }): Promise<boolean> {
    const count = await this.appRepo.count({
      where: { ...condition, isDeleted: IWhetherStatus.NO },
    });
    return count > 0;
  }

  /**
   * 查询应用基础信息（内部复用）
   */
  async findOne(appId: string): Promise<HsApplicationEntity> {
    const app = await this.appRepo.findOne({
      where: { id: appId, isDeleted: IWhetherStatus.NO },
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
  ): Promise<IAppWithConfig> {
    // 查询应用基础信息
    const application = await this.findOne(appId);

    // 确定版本
    const targetVersion = versionId
      ? await this.versionService.findOne(versionId)
      : await this.versionService.findLatestVersion(appId);

    // 查询配置
    const { globalConfig, menuConfig, headerConfig } =
      await this.configService.getConfigsByVersion(appId, targetVersion.id);

    return {
      ...application,
      version: targetVersion,
      globalConfig,
      menuConfig,
      headerConfig,
    };
  }
}
