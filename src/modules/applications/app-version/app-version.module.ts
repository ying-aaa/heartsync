import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsAppVersionService } from './app-version.service';
import { HsAppVersionController } from './app-version.controller';
import { HsAppVersionEntity } from 'src/database/entities/hs-app-version.entity';
import { HsApplicationModule } from '../app/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HsAppVersionEntity]),
    forwardRef(() => HsApplicationModule),
  ],
  providers: [HsAppVersionService],
  controllers: [HsAppVersionController],
  exports: [HsAppVersionService, HsApplicationModule],
})
export class HsAppVersionModule {}
