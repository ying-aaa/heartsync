import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsSelfRecordService } from './self-record/self-record.service';
import { HsSelfRecordController } from './self-record/self-record.controller';
import { HsSelfRecord } from '../../database/entities/hs-self-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsSelfRecord])],
  providers: [HsSelfRecordService],
  controllers: [HsSelfRecordController],
})
export class SelfModule {}
