import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFormWidget } from './form-widget/form-widget.entity';
import { HsFormWidgetsController } from './form-widget/form-widget.controller';
import { HsFormWidgetsService } from './form-widget/form-widget.service';
import { HsCodeWidget } from './code-wieget/code-widget.entity';
import { HsCodeWidgetsService } from './code-wieget/code-widget.service';
import { HsCodeWidgetsController } from './code-wieget/code-widget.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HsFormWidget, HsCodeWidget])],
  providers: [HsFormWidgetsService, HsCodeWidgetsService],
  controllers: [HsFormWidgetsController, HsCodeWidgetsController],
})
export class WidgetsModule {}
