import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsApplication } from './entities/application.entity';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';
import { PageDto } from 'src/common/dtos/page.dto';

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
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<HsApplication>> {
    return this.paginationService.paginate(
      this.applicationRepository,
      pageOptionsDto,
    );
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
