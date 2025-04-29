import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsApplication } from './entities/application.entity';
import { HsApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { HsPaginationService } from 'src/common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([HsApplication])],
  providers: [HsApplicationService, HsPaginationService],
  controllers: [ApplicationController],
})
export class HsApplicationModule {}
