import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsWidgetController } from './widget.controller';
import { HsWidgetService } from './widget.service';
import { HsWidget } from '../entities/widget.entity';
import { HsFormWidgetModule } from '../types/form-widget/form-widget.module';
import { HsWidgetServiceFactory } from '../widget-service.factory';

@Module({
  imports: [TypeOrmModule.forFeature([HsWidget]), HsFormWidgetModule],
  controllers: [HsWidgetController],
  providers: [HsWidgetService, HsWidgetServiceFactory],
  exports: [HsWidgetService, HsFormWidgetModule],
})
export class HsWidgetModule {}
