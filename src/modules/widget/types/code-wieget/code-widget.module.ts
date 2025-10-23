import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsCodeWidgetEntity } from '../../../../database/entities/hs-code-widget.entity';
import { HsCodeWidgetsController } from './code-widget.controller';
import { HsCodeWidgetsService } from './code-widget.service';
@Module({
  imports: [TypeOrmModule.forFeature([HsCodeWidgetEntity])],
  controllers: [HsCodeWidgetsController],
  providers: [HsCodeWidgetsService],
  exports: [HsCodeWidgetsService],
})
export class HsCodeWidgetModule {}
