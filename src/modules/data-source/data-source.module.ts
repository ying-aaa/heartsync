import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { HsDataSourceController } from './data-source.controller';
import { HsDataSourceService } from './data-source.service';
import { HsConnectionPoolService } from './connection-pool.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { HsPaginationService } from 'src/common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([HsDataSourceEntity])],
  controllers: [HsDataSourceController],
  providers: [
    HsDataSourceService,
    HsConnectionPoolService,
    HsLoggerService,
    HsPaginationService,
  ],
  exports: [HsDataSourceService, HsConnectionPoolService],
})
export class HsDataSourceModule {}
