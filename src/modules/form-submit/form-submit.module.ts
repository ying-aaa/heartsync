import { Module } from '@nestjs/common';
import { HsDataSourceModule } from '../data-source/data-source.module';
import { HsFormSubmitController } from './form-submit.controller';
import { HsFormSubmitService } from './form-submit.service';
import { HsConnectionPoolService } from 'src/common/services/connection-pool.service';
import { HsLoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [
    HsDataSourceModule, // 导入数据源模块（用于获取数据源配置）
  ],
  controllers: [HsFormSubmitController],
  providers: [HsFormSubmitService, HsConnectionPoolService, HsLoggerService],
})
export class HsFormSubmitModule {}
