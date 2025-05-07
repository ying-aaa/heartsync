import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFormWidget } from './form-widget.entity';
import { HsFormWidgetsController } from './form-widget.controller';
import { HsFormWidgetsService } from './form-widget.service';
@Module({
  imports: [TypeOrmModule.forFeature([HsFormWidget])],
  controllers: [HsFormWidgetsController],
  providers: [HsFormWidgetsService],
  exports: [HsFormWidgetsService],
})
export class HsFormWidgetModule {}
