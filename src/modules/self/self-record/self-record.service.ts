import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsSelfRecord } from '../../../database/entities/hs-self-record.entity';

@Injectable()
export class HsSelfRecordService {
  constructor(
    @InjectRepository(HsSelfRecord)
    private hsSelfRecordRepository: Repository<HsSelfRecord>,
  ) {}

  async create(record: Partial<HsSelfRecord>): Promise<HsSelfRecord> {
    const newRecord = this.hsSelfRecordRepository.create(record);
    return this.hsSelfRecordRepository.save(newRecord);
  }

  async findAll(): Promise<HsSelfRecord[]> {
    return this.hsSelfRecordRepository.find();
  }

  async findOne(id: number): Promise<HsSelfRecord> {
    return this.hsSelfRecordRepository.findOneBy({ id });
  }

  async update(
    id: number,
    record: Partial<HsSelfRecord>,
  ): Promise<HsSelfRecord> {
    await this.hsSelfRecordRepository.update(id, record);
    return this.hsSelfRecordRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.hsSelfRecordRepository.delete(id);
  }
}
