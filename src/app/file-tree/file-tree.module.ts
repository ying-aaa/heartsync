import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTreeService } from './file-tree.service';
import { FileTreeController } from './file-tree.controller';
import { HsFileNode } from './entities/file-node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HsFileNode])],
  controllers: [FileTreeController],
  providers: [FileTreeService],
  exports: [FileTreeService],
})
export class HsFileTreeModule {}
