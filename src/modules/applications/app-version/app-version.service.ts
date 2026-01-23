import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HsAppVersionEntity } from 'src/database/entities/hs-app-version.entity';
import { IAppVersionStatus } from '@heartsync/types';
import { EntityManager, Repository } from 'typeorm';
import { CreateAppVersionDto } from './dto/create-app-version.dto';
import { HsApplicationService } from '../app/application.service';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { PageDto } from 'src/common/dtos/page.dto';
import { QueryAppVersionDto } from './dto/query-app-version.dto';

@Injectable()
export class HsAppVersionService {
  constructor(
    @InjectRepository(HsAppVersionEntity)
    public readonly versionRepo: Repository<HsAppVersionEntity>,
    @Inject(forwardRef(() => HsApplicationService))
    private readonly appService: HsApplicationService,
    private readonly paginationService: HsPaginationService,
  ) {}

  /**
   * 查询应用所有版本
   * @param appId 应用ID
   */
  async findAll(
    queryDto: QueryAppVersionDto,
  ): Promise<PageDto<HsAppVersionEntity>> {
    return this.paginationService.paginate(this.versionRepo, queryDto);
  }

  /**
   * 创建版本（独立接口）
   * @param dto 版本创建参数
   */
  async create(
    dto: CreateAppVersionDto,
    manager?: EntityManager,
  ): Promise<HsAppVersionEntity> {
    if (!manager) {
      await this.appService.findOne(dto.appId);
    }

    const existVersion = await this.versionRepo.findOne({
      where: { appId: dto.appId, versionCode: dto.versionCode },
    });
    if (existVersion) {
      throw new BadRequestException(
        `应用${dto.appId}的版本号${dto.versionCode}已存在`,
      );
    }

    const version = this.versionRepo.create({
      ...dto,
      status: IAppVersionStatus.DRAFT,
    });

    if (manager) {
      return manager.save(version);
    }
    return this.versionRepo.save(version);
  }

  /**
   * 查询版本详情
   * @param id 版本ID
   */
  async findOne(id: string): Promise<HsAppVersionEntity> {
    const version = await this.versionRepo.findOne({ where: { id } });
    if (!version) {
      throw new NotFoundException(`版本ID${id}不存在`);
    }
    return version;
  }

  /**
   * 查询应用的最新版本（优先已发布）
   * @param appId 应用ID
   */
  async findLatestVersion(appId: string): Promise<HsAppVersionEntity> {
    // 优先查已发布版本（最新发布）
    const publishedVersion = await this.versionRepo.findOne({
      where: { appId, status: IAppVersionStatus.PUBLISHED },
      order: { publishTime: 'DESC' },
    });
    if (publishedVersion) {
      return publishedVersion;
    }

    // 再查草稿版本（最新创建）
    const draftVersion = await this.versionRepo.findOne({
      where: { appId, status: IAppVersionStatus.DRAFT },
      order: { createTime: 'DESC' },
    });
    if (!draftVersion) {
      throw new NotFoundException(`应用${appId}暂无版本数据`);
    }
    return draftVersion;
  }

  /**
   * 发布版本
   * @param id 版本ID
   * @param publishUserId 发布人ID
   */
  async publish(
    id: string,
    publishUserId: string,
  ): Promise<HsAppVersionEntity> {
    const version = await this.findOne(id);

    if (version.status === IAppVersionStatus.PUBLISHED) {
      throw new BadRequestException(`版本${version.versionCode}已发布`);
    }

    version.status = IAppVersionStatus.PUBLISHED;
    version.publishTime = new Date();
    version.publishUserId = publishUserId;

    return this.versionRepo.save(version);
  }
}
