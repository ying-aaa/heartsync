import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFormWidgetEntity } from '../../../../database/entities/hs-form-widget.entity';
import { HsFormWidgetsController } from './form-widget.controller';
import { HsFormWidgetsService } from './form-widget.service';
@Module({
  imports: [TypeOrmModule.forFeature([HsFormWidgetEntity])],
  controllers: [HsFormWidgetsController],
  providers: [HsFormWidgetsService],
  exports: [HsFormWidgetsService],
})
export class HsFormWidgetModule {}
