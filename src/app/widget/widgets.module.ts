import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { Widget } from './widget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Widget])],
  providers: [WidgetsService],
  controllers: [WidgetsController],
})
export class WidgetsModule {}
