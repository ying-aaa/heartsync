import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsApplicationEntity } from '../../../database/entities/hs-application.entity';
import { HsApplicationService } from './application.service';
import { HsPaginationService } from 'src/common/services/pagination.service';
import { HsApplicationController } from './application.controller';
import { HsAppVersionModule } from '../app-version/app-version.module';
import { HsAppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HsApplicationEntity]),
    forwardRef(() => HsAppVersionModule),
    HsAppConfigModule,
  ],
  providers: [HsApplicationService, HsPaginationService],
  controllers: [HsApplicationController],
  exports: [HsAppConfigModule],
})
export class HsApplicationModule {}
