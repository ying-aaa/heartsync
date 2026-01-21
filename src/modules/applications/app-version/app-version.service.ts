// src/modules/app-version/app-version.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HsAppVersionEntity,
  HsAppVersionStatus,
} from 'src/database/entities/hs-app-version.entity';
import { Repository } from 'typeorm';
import { HsApplicationService } from '../app/application.service';
import { CreateAppVersionDto } from './dto/create-app-version.dto';

@Injectable()
export class HsAppVersionService {
  constructor(
    @InjectRepository(HsAppVersionEntity)
    private readonly versionRepo: Repository<HsAppVersionEntity>,
    @Inject(forwardRef(() => HsApplicationService))
    private readonly appService: HsApplicationService,
  ) {}

  /**
   * 创建版本（独立接口）
   * @param dto 版本创建参数
   */
  async create(dto: CreateAppVersionDto): Promise<HsAppVersionEntity> {
    // 1. 校验应用是否存在
    await this.appService.findOne(dto.applicationId);

    // 2. 校验版本号是否重复
    const existVersion = await this.versionRepo.findOne({
      where: { applicationId: dto.applicationId, versionCode: dto.versionCode },
    });
    if (existVersion) {
      throw new BadRequestException(
        `应用${dto.applicationId}的版本号${dto.versionCode}已存在`,
      );
    }

    // 3. 创建版本
    const version = this.versionRepo.create({
      ...dto,
      status: HsAppVersionStatus.DRAFT,
    });
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
   * @param applicationId 应用ID
   */
  async findLatestVersion(applicationId: string): Promise<HsAppVersionEntity> {
    // 优先查已发布版本（最新发布）
    const publishedVersion = await this.versionRepo.findOne({
      where: { applicationId, status: HsAppVersionStatus.PUBLISHED },
      order: { publishTime: 'DESC' },
    });
    if (publishedVersion) {
      return publishedVersion;
    }

    // 再查草稿版本（最新创建）
    const draftVersion = await this.versionRepo.findOne({
      where: { applicationId, status: HsAppVersionStatus.DRAFT },
      order: { createTime: 'DESC' },
    });
    if (!draftVersion) {
      throw new NotFoundException(`应用${applicationId}暂无版本数据`);
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

    if (version.status === HsAppVersionStatus.PUBLISHED) {
      throw new BadRequestException(`版本${version.versionCode}已发布`);
    }

    version.status = HsAppVersionStatus.PUBLISHED;
    version.publishTime = new Date();
    version.publishUserId = publishUserId;

    return this.versionRepo.save(version);
  }
}
