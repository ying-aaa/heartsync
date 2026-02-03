import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsDashboardController } from './dashboard.controller';
import { HsDashboardService } from './dashboard.service';
import { HsDashboardEntity } from 'src/database/entities/hs-dashboard.entity';
import { HsFileTreeModule } from '../file-tree/file-tree.module';
import { HsWidgetModule } from '../widget/widget/widget.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HsDashboardEntity]),
    HsFileTreeModule,
    HsWidgetModule,
  ],
  controllers: [HsDashboardController],
  providers: [HsDashboardService],
  exports: [HsDashboardService],
})
export class HsDashboardModule {}
