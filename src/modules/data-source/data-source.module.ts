import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { HsDataSourceController } from './data-source.controller';
import { HsDataSourceService } from './data-source.service';
import { HsConnectionPoolService } from './connection-pool.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsDbFactoryService } from 'src/common/services/db-factory.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([HsDataSourceEntity])],
  controllers: [HsDataSourceController],
  providers: [
    HsDataSourceService,
    HsConnectionPoolService,
    HsLoggerService,
    HsPaginationService,
    HsDbFactoryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [HsDataSourceService, HsConnectionPoolService],
})
export class HsDataSourceModule {}
