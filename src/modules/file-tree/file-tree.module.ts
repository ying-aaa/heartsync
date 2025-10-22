import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFileTreeService } from './file-tree.service';
import { HsFileTreeController } from './file-tree.controller';
import { HsFileNodeEntity } from '../../database/entities/hs-file-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsFileNodeEntity])],
  controllers: [HsFileTreeController],
  providers: [HsFileTreeService],
  exports: [HsFileTreeService],
})
export class HsFileTreeModule {}
