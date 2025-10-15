import { Module } from '@nestjs/common';
import { HsDynamicTableService } from './dynamic-table.service';
import { HsLoggerService } from 'src/common/services/logger.service';
import { HsDynamicTableController } from './dynamic-table.controller';
import { HsDataSourceModule } from '../data-source/data-source.module';
import { HsAssetModule } from '../asset/asset.module';

@Module({
  imports: [HsDataSourceModule, HsAssetModule],
  controllers: [HsDynamicTableController],
  providers: [HsDynamicTableService, HsLoggerService],
  exports: [HsDynamicTableService],
})
export class HsDynamicTableModule {}
