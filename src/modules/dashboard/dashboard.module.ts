import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsDashboardController } from './dashboard.controller';
import { HsDashboardService } from './dashboard.service';
import { HsDashboard } from 'src/database/entities/hs-dashboard.entity';
import { HsFileTreeModule } from '../file-tree/file-tree.module';

@Module({
  imports: [TypeOrmModule.forFeature([HsDashboard]), HsFileTreeModule],
  controllers: [HsDashboardController],
  providers: [HsDashboardService],
  exports: [HsDashboardService],
})
export class HsDashboardModule {}
