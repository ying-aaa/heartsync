import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFormWidget } from './form-widget/form-widget.entity';
import { HsFormWidgetsController } from './form-widget/form-widget.controller';
import { HsFormWidgetsService } from './form-widget/form-widget.service';

@Module({
  imports: [TypeOrmModule.forFeature([HsFormWidget])],
  providers: [HsFormWidgetsService],
  controllers: [HsFormWidgetsController],
})
export class WidgetsModule {}
