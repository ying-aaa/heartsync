// src/file/file.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HsUploadService } from './upload.service';

@Controller('files')
export class HsFileController {
  constructor(private readonly uploadService: HsUploadService) {}

  // 创建存储桶
  @Post('buckets/:bucketName')
  async createBucket(@Param('bucketName') bucketName: string) {
    return this.uploadService.createBucket(bucketName);
  }

  // 文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Query('bucket') bucket: string,
    @Query('path') path?: string,
    @Query('access') access: 'public' | 'private' = 'public',
  ) {
    return this.uploadService.uploadFile({
      bucket,
      file,
      path,
      access,
    });
  }

  // 文件地址查询
  @Get('url')
  async getFileUrl(
    @Query('bucket') bucket: string,
    @Query('path') path?: string,
    @Query('type') type: 'public' | 'private' = 'public',
  ) {
    return this.uploadService.getFileUrl(bucket, path, type);
  }

  // 文件列表查询
  @Get('list')
  async listFiles(
    @Query('bucket') bucket: string,
    @Query('path') path?: string,
  ) {
    return this.uploadService.listFiles(bucket, path);
  }

  // 文件删除
  @Delete()
  async deleteFile(
    @Query('bucket') bucket: string,
    @Query('path') path: string,
  ) {
    return this.uploadService.deleteFile(bucket, path);
  }
}
