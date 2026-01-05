import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { imageSize } from 'image-size';
import { HsResourceCategory } from 'src/database/entities/hs-resource-category.entity';
import { HsResource } from 'src/database/entities/hs-resource.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdatedResourceDto } from './dto/updated-resource.dto';

@Injectable()
export class HsUploadService {
  private minioClient: Minio.Client;

  constructor(
    private readonly minioService: MinioService,
    @InjectRepository(HsResource)
    private readonly resourceRepository: Repository<HsResource>,
    @InjectRepository(HsResourceCategory)
    private readonly categoryRepository: Repository<HsResourceCategory>,
  ) {
    this.minioClient = this.minioService.client;
  }

  async createBucket(bucket: string) {
    try {
      const exists = await this.minioClient.bucketExists(bucket);
      if (!exists) {
        await this.minioClient.makeBucket(bucket, 'us-east-1');
        // 设置公开访问策略
        await this.minioClient.setBucketPolicy(
          bucket,
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
              },
            ],
          }),
        );
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException('桶创建失败！' + error);
    }
  }

  // 创建分类
  async createCategory(dto: CreateCategoryDto) {
    const { bucket, name, sort_order = 0 } = dto;

    const existing = await this.categoryRepository.findOne({
      where: { bucket, name },
    });
    if (existing) {
      throw new ConflictException(`分类 "${name}" 已存在`);
    }

    const pathId = uuidv4();

    await this.minioClient.putObject(bucket, `${pathId}/`, Buffer.from(''), 0, {
      'Content-Type': 'application/x-directory',
    });

    const category = this.categoryRepository.create({
      id: pathId,
      bucket,
      name,
      sort_order,
    });
    await this.categoryRepository.save(category);

    return category;
  }

  // 修改分类
  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const { name } = dto;

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    const existing = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException(`分类 "${name}" 已存在`);
    }

    // 不能修改默认分类
    if (category.is_default) {
      throw new ConflictException('默认分类不能修改');
    }

    category.name = name;
    await this.categoryRepository.save(category);

    return category;
  }

  // 获取分类列表
  async getCategories(bucket: string) {
    const res = await this.categoryRepository.find({
      where: { bucket },
      order: { sort_order: 'ASC' },
    });
    return res.map((item) => ({
      id: item.id,
      name: item.name,
      sort_order: item.sort_order,
      created_at: item.created_at,
    }));
  }

  // 获取分类下的资源列表
  async getResourcesByCategory(bucket: string, category_id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: category_id, bucket },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return this.resourceRepository.find({
      where: { bucket, category_id },
    });
  }

  // 根据资源id获取资源信息
  async getResourceById(id: string) {
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException('资源不存在');
    }
    return resource;
  }

  // 上传资源到分类
  async uploadResource(params: {
    bucket: string;
    file: any;
    path?: string;
    access: 'public' | 'private';
  }) {
    const originalname = Buffer.from(
      params.file.originalname,
      'latin1',
    ).toString('utf8');
    const extensionName = originalname.split('.').pop();
    const pathFileName = `${uuidv4()}.${extensionName}`;

    try {
      let category_id = null;
      const categoryName = params.path || 'common';
      const category = await this.categoryRepository.findOne({
        where: { bucket: params.bucket, name: categoryName },
      });
      if (category) {
        category_id = category.id;
      } else {
        const res = await this.createCategory({
          bucket: params.bucket,
          name: categoryName,
        });
        category_id = res.id;
      }

      const path = `${category_id}/${pathFileName}`;

      const metaData = {
        'Content-Type': params.file.mimetype,
        'x-amz-acl': params.access === 'public' ? 'public-read' : 'private',
      };

      await this.minioClient.putObject(
        params.bucket,
        path,
        params.file.buffer,
        params.file.size,
        metaData,
      );

      let width, height;
      if (params.file.mimetype.startsWith('image/')) {
        const dimensions = imageSize(params.file.buffer);
        width = dimensions.width;
        height = dimensions.height;
      }

      const url = `/${params.bucket}/${path}`;

      const resource = this.resourceRepository.create({
        bucket: params.bucket,
        original_name: originalname,
        url,
        path,
        size: params.file.size,
        mime_type: params.file.mimetype,
        width,
        height,
        access_type: params.access,
        category_id,
      });
      await this.resourceRepository.save(resource);

      return resource;
    } catch (error) {
      throw new InternalServerErrorException('上传资源失败！' + error);
    }
  }

  // 修改资源信息
  async updateResource(id: string, dto: UpdatedResourceDto) {
    console.log('%c Line:232 🍢 id', 'color:#b03734', id);
    const { original_name, category_id: targetCategoryId } = dto;
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException('资源不存在');
    }

    const { bucket, category_id: sourceCategoryId, path, url } = resource;
    console.log('%c Line:241 🍿 bucket', 'color:#2eafb0', bucket);

    if (targetCategoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: targetCategoryId, bucket },
      });
      if (!category) {
        throw new NotFoundException('分类不存在');
      }
      try {
        const sourceKey = url;
        console.log('%c Line:252 🥥 sourceKey', 'color:#93c0a4', sourceKey);
        // 旧的路径替换为新的路径
        const targetKey = path.replace(sourceCategoryId, targetCategoryId);
        console.log('%c Line:255 🍩 targetKey', 'color:#465975', targetKey);
        const res = await this.minioClient.statObject(bucket, sourceKey);
        console.log('%c Line:255 🥟 res', 'color:#3f7cff', res);

        // 复制对象到新路径
        await this.minioClient.copyObject(
          bucket,
          targetKey,
          sourceKey,
          new Minio.CopyConditions(),
        );
        console.log('%c Line:264 🌰', 'color:#3f7cff');

        // 删除原对象
        await this.minioClient.removeObject(bucket, sourceKey);
        console.log('%c Line:268 🍰', 'color:#b03734');
      } catch (error) {
        throw new NotFoundException('资源移动失败' + error);
      }

      resource.category_id = targetCategoryId;
    }

    if (original_name) {
      const existing = await this.resourceRepository.findOne({
        where: { original_name, bucket: resource.bucket },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`资源 "${original_name}" 已存在`);
      }
      resource.original_name = original_name;
    }

    // 默认资源不能删除
    if (resource.is_default) {
      throw new ConflictException('默认资源不能修改');
    }

    await this.resourceRepository.save(resource);

    return resource;
  }

  // 删除分类
  // async deleteCategory(bucket: string, path_id: number) {
  //   const category = await this.categoryRepository.findOne({
  //     where: { id: path_id, bucket },
  //   });
  //   if (!category) {
  //     throw new NotFoundException('分类不存在');
  //   }

  //   const stream = this.minioClient.listObjectsV2(
  //     bucket,
  //     category.categories_id,
  //     true,
  //   );
  //   for await (const obj of stream) {
  //     await this.minioClient.removeObject(bucket, obj.name);
  //   }

  //   await this.minioClient.removeObject(bucket, `${category.categories_id}/`);
  //   await this.categoryRepository.delete(path_id);

  //   return true;
  // }

  // 删除资源
  async deleteResource(bucket: string, id: string, path: string) {
    // if (id) {
    //   const resource = await this.resourceRepository.findOne({
    //     where: { id, bucket },
    //   });
    //   if (!resource) {
    //     throw new NotFoundException('资源不存在');
    //   }
    //   await this.minioClient.removeObject(
    //     bucket,
    //     `${resource.category_id}/${resource.original_name}`,
    //   );
    //   await this.resourceRepository.delete({ id });
    // }
    // if (path) {
    //   const resource = await this.resourceRepository.findOne({
    //     where: { url: path, bucket },
    //   });
    //   if (!resource) {
    //     throw new NotFoundException('资源不存在');
    //   }
    //   await this.minioClient.removeObject(
    //     bucket,
    //     `${resource.category_id}/${resource.original_name}`,
    //   );
    //   await this.resourceRepository.delete({ id });
    // }
    return '抱歉，暂不支持删除资源';
  }
}
