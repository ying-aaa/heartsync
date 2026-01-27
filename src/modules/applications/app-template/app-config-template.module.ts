import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigTemplateService } from './app-config-template.service';
import { AppConfigTemplateController } from './app-config-template.controller';
import { HsAppConfigTemplate } from 'src/database/entities/hs-app-config-template.entity';

/**
 * 应用配置模板模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([HsAppConfigTemplate])],
  controllers: [AppConfigTemplateController],
  providers: [AppConfigTemplateService],
  exports: [AppConfigTemplateService],
})
export class AppConfigTemplateModule {}
