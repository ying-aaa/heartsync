import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HsUploadService } from './upload.service';
import { HsFileController } from './upload.controller';
import { MinioModule } from 'nestjs-minio-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsResourceCategory } from 'src/database/entities/hs-resource-category.entity';
import { HsResource } from 'src/database/entities/hs-resource.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([HsResourceCategory, HsResource]),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          useSSL: false,
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],

  providers: [HsUploadService],
  controllers: [HsFileController],
})
export class HsUploadModule {}
