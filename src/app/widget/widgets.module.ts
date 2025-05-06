import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsCodeWidget } from './types/code-wieget/code-widget.entity';
import { HsCodeWidgetsService } from './types/code-wieget/code-widget.service';
import { HsCodeWidgetsController } from './types/code-wieget/code-widget.controller';
import { HsWidgetModule } from './widget/widget.module';

@Module({
  controllers: [HsCodeWidgetsController],
  imports: [TypeOrmModule.forFeature([HsCodeWidget]), HsWidgetModule],
  providers: [HsCodeWidgetsService],
  exports: [HsWidgetModule],
})
export class WidgetsModule {}
