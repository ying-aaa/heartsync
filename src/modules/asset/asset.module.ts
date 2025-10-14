import { Module } from '@nestjs/common';
import { HsAssetController } from './asset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsAssetService } from './asset.service';
import { HsBusinessFieldEntity } from 'src/database/entities/hs-business-field.entity';
import { HsAssetTableEntity } from 'src/database/entities/hs-asset-table.entity';
import { HsAssetRelationEntity } from 'src/database/entities/hs-asset-relation.entity';
import { HsAssetFieldEntity } from 'src/database/entities/hs-asset-field.entity';
import { HsAssetSyncService } from './asset-sync.service';
import { HsDataSourceModule } from '../data-source/data-source.module';
import { HsLoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HsBusinessFieldEntity,
      HsAssetTableEntity,
      HsAssetRelationEntity,
      HsAssetFieldEntity,
    ]),
    HsDataSourceModule,
  ],
  controllers: [HsAssetController],
  providers: [HsAssetService, HsAssetSyncService, HsLoggerService],
  exports: [HsAssetService, HsAssetSyncService],
})
export class HsAssetModule {}
