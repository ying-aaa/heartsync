import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsApplication } from '../../database/entities/hs-application.entity';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { PageDto } from 'src/common/dtos/page.dto';
import { QueryApplicationDto } from './dto/query-application.dto';

@Injectable()
export class HsApplicationService {
  constructor(
    @InjectRepository(HsApplication)
    private applicationRepository: Repository<HsApplication>,
    private readonly paginationService: HsPaginationService,
  ) {}

  async create(createApplicationDto: any): Promise<HsApplication> {
    const application = this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(application) as any;
  }

  async findAll(
    queryApplicationDto: QueryApplicationDto,
  ): Promise<PageDto<HsApplication>> {
    return this.paginationService.paginate(
      this.applicationRepository,
      queryApplicationDto,
    );
  }

  // 判断是否存在数据
  async hasData(condition: { [key: string]: any }): Promise<boolean> {
    const count = await this.applicationRepository.count({ where: condition });
    return count > 0;
  }

  async findOne(id: string): Promise<HsApplication> {
    return this.applicationRepository.findOneBy({ id });
  }

  async update(id: string, updateApplicationDto: any): Promise<HsApplication> {
    await this.applicationRepository.update(id, updateApplicationDto);
    return this.applicationRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.applicationRepository.delete(id);
  }
}
