// src/modules/app-config/app-config.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsAppConfigService } from './app-config.service';
import { HsAppConfigController } from './app-config.controller';
import { HsAppMenuConfigEntity } from 'src/database/entities/hs-app-menu-config.entity';
import { HsAppGlobalConfigEntity } from 'src/database/entities/hs-app-global-config.entity';
import { HsAppHeaderConfigEntity } from 'src/database/entities/hs-app-header-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HsAppGlobalConfigEntity,
      HsAppMenuConfigEntity,
      HsAppHeaderConfigEntity,
    ]),
  ],
  providers: [HsAppConfigService],
  controllers: [HsAppConfigController],
  exports: [HsAppConfigService],
})
export class HsAppConfigModule {}
