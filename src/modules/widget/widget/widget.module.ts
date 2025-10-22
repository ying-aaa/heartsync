import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsWidgetController } from './widget.controller';
import { HsWidgetService } from './widget.service';
import { HsWidgetEntity } from '../../../database/entities/hs-widget.entity';
import { HsFormWidgetModule } from '../types/form-widget/form-widget.module';
import { HsWidgetServiceFactory } from '../widget-service.factory';
import { HsFileTreeModule } from 'src/modules/file-tree/file-tree.module';
import { HsCodeWidgetModule } from '../types/code-wieget/code-widget.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HsWidgetEntity]),
    HsFormWidgetModule,
    HsCodeWidgetModule,
    HsFileTreeModule,
  ],
  controllers: [HsWidgetController],
  providers: [HsWidgetService, HsWidgetServiceFactory],
  exports: [HsWidgetService, HsFormWidgetModule, HsCodeWidgetModule],
})
export class HsWidgetModule {}
