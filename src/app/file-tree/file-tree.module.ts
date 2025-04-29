import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsFileTreeService } from './file-tree.service';
import { HsFileTreeController } from './file-tree.controller';
import { HsFileNode } from './entities/file-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsFileNode])],
  controllers: [HsFileTreeController],
  providers: [HsFileTreeService],
  exports: [HsFileTreeService],
})
export class HsFileTreeModule {}
