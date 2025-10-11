import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsDataSourceEntity } from 'src/database/entities/hs-data-source.entity';
import { HsDataSourceController } from './data-source.controller';
import { HsDataSourceService } from './data-source.service';

@Module({
  imports: [TypeOrmModule.forFeature([HsDataSourceEntity])],
  controllers: [HsDataSourceController],
  providers: [HsDataSourceService],
  exports: [HsDataSourceService],
})
export class HsDataSourceModule {}
