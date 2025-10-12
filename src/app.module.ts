// src/app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsPaginationService } from './common/services/pagination.service';
import { FileProxyMiddleware } from './common/middlewares/file-proxy.middleware';
import { HsApplicationModule } from './modules/applications/application.module';
import { HsFileTreeModule } from './modules/file-tree/file-tree.module';
import { SelfModule } from './modules/self/self.module';
import { HsUploadModule } from './modules/upload/upload.module';
import { WidgetsModule } from './modules/widget/widgets.module';
import { HsDashboardModule } from './modules/dashboard/dashboard.module';
import { HsMenuModule } from './modules/menu/hs-menu.module';
import { HsDataSourceModule } from './modules/data-source/data-source.module';
import { HsLoggerService } from './common/services/logger.service';

@Module({
  providers: [HsPaginationService],
  exports: [HsPaginationService],
  imports: [
    SelfModule,
    HsMenuModule,
    WidgetsModule,
    HsUploadModule,
    HsDashboardModule,
    HsFileTreeModule,
    HsApplicationModule,
    HsDataSourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileProxyMiddleware)
      .forRoutes({ path: 'heartsync-files', method: RequestMethod.ALL });
  }
}
