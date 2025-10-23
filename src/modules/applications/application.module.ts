import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsApplicationEntity } from '../../database/entities/hs-application.entity';
import { HsApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { HsPaginationService } from 'src/common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([HsApplicationEntity])],
  providers: [HsApplicationService, HsPaginationService],
  controllers: [ApplicationController],
})
export class HsApplicationModule {}
