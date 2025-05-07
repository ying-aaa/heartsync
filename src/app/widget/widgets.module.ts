import { Module } from '@nestjs/common';
import { HsCodeWidgetsController } from './types/code-wieget/code-widget.controller';
import { HsWidgetModule } from './widget/widget.module';

@Module({
  controllers: [HsCodeWidgetsController],
  imports: [HsWidgetModule],
  providers: [],
  exports: [HsWidgetModule],
})
export class WidgetsModule {}
