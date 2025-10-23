import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsSelfRecordEntity } from '../../../database/entities/hs-self-record.entity';

@Injectable()
export class HsSelfRecordService {
  constructor(
    @InjectRepository(HsSelfRecordEntity)
    private hsSelfRecordRepository: Repository<HsSelfRecordEntity>,
  ) {}

  async create(record: Partial<HsSelfRecordEntity>): Promise<HsSelfRecordEntity> {
    const newRecord = this.hsSelfRecordRepository.create(record);
    return this.hsSelfRecordRepository.save(newRecord);
  }

  async findAll(): Promise<HsSelfRecordEntity[]> {
    return this.hsSelfRecordRepository.find();
  }

  async findOne(id: number): Promise<HsSelfRecordEntity> {
    return this.hsSelfRecordRepository.findOneBy({ id });
  }

  async update(
    id: number,
    record: Partial<HsSelfRecordEntity>,
  ): Promise<HsSelfRecordEntity> {
    await this.hsSelfRecordRepository.update(id, record);
    return this.hsSelfRecordRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.hsSelfRecordRepository.delete(id);
  }
}
