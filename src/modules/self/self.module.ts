import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsSelfRecordService } from './self-record/self-record.service';
import { HsSelfRecordController } from './self-record/self-record.controller';
import { HsSelfRecordEntity } from '../../database/entities/hs-self-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsSelfRecordEntity])],
  providers: [HsSelfRecordService],
  controllers: [HsSelfRecordController],
})
export class SelfModule {}
