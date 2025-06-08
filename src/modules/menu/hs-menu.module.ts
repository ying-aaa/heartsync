import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsMenuController } from './hs-menu.controller';
import { HsMenuService } from './hs-menu.service';
import { HsMenuEntity } from 'src/database/entities/hs-menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsMenuEntity])],
  controllers: [HsMenuController],
  providers: [HsMenuService],
  exports: [HsMenuService],
})
export class HsMenuModule {}
