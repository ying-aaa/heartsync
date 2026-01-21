import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsApplicationEntity } from '../../../database/entities/hs-application.entity';
import { HsApplicationService } from './application.service';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsApplicationController } from './application.controller';
import { HsAppConfigService } from '../app-config/app-config.service';
import { HsAppVersionModule } from '../app-version/app-version.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HsApplicationEntity]),
    HsAppVersionModule,
  ],
  providers: [HsApplicationService, HsPaginationService, HsAppConfigService],
  controllers: [HsApplicationController],
  exports: [HsAppConfigService, HsAppVersionModule],
})
export class HsApplicationModule {}
