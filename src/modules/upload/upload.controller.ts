import {
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HsUploadService } from './upload.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { QueryResourceDto, UpdatedResourceDto } from './dto/resource.dto';

@Controller('files') // 路径改为 resources
export class HsFileController {
  constructor(private readonly uploadService: HsUploadService) {}

  // 创建存储桶
  @Post('buckets/:bucketName')
  async createBucket(@Param('bucketName') bucketName: string) {
    return this.uploadService.createBucket(bucketName);
  }

  // 创建分类（带排序）
  @Post('categories')
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.uploadService.createCategory(category);
  }

  // 修改分类
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.uploadService.updateCategory(id, category);
  }

  // 获取分类列表（带排序）
  @Get('categories')
  async getCategories(@Query('bucket') bucket: string) {
    return this.uploadService.getCategories(bucket);
  }

  // 获取分类下的资源列表
  @Get('category')
  async getResourcesByCategory(@Query() queryResourceDto: QueryResourceDto) {
    return this.uploadService.getResourcesByCategory(queryResourceDto);
  }

  // 根据资源id获取资源信息
  @Get('resources/:id')
  async getResourceById(@Param('id') id: string) {
    return this.uploadService.getResourceById(id);
  }

  // 资源上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResource(
    @UploadedFile() file: any,
    @Query('bucket') bucket: string,
    @Query('path') path?: string,
    @Query('access') access: 'public' | 'private' = 'public',
  ) {
    return this.uploadService.uploadResource({
      bucket,
      file,
      path,
      access,
    });
  }

  // 修改资源信息
  @Put('resources/:id')
  async updateResource(
    @Param('id') id: string,
    @Body() resource: UpdatedResourceDto,
  ) {
    return this.uploadService.updateResource(id, resource);
  }

  // 删除分类
  // @Delete("categories")
  // async deleteCategory(
  //   @Query('bucket') bucket: string,
  //   @Query('path') path: string,
  // ) {
  //   return this.uploadService.deleteCategory(bucket, path);
  // }

  // 删除资源
  @Delete()
  async deleteResource(
    @Query('bucket') bucket: string,
    @Query('id') id: string,
    @Query('path') path: string,
  ) {
    return this.uploadService.deleteResource(bucket, id, path);
  }
}
