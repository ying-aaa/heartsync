// src/minio/minio.service.ts
import * as Minio from 'minio';
import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HsUploadService {
  private minioClient: Minio.Client;

  constructor(private readonly minioService: MinioService) {
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

  async uploadFile(params: {
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
      const path = params.path
        ? `${params.path}/${pathFileName}`
        : 'common/' + pathFileName;

      // 设置正确的 Content-Type
      const metaData = {
        'Content-Type': params.file.mimetype, // 使用文件的 MIME 类型
        'x-amz-acl': params.access === 'public' ? 'public-read' : 'private', // 设置 ACL
      };

      // 上传文件
      await this.minioClient.putObject(
        params.bucket,
        path,
        params.file.buffer,
        params.file.size,
        metaData,
      );

      // 返回上传结果和公共 URL（如果文件是公开的）
      const url = `/${params.bucket}/${path}`;

      return {
        url, // 如果文件是公开的，返回公共 URL
        name: originalname,
        // path,
        // size: params.file.size,
        // mimetype: params.file.mimetype,
      };
    } catch (error) {
      throw new InternalServerErrorException('上传文件失败！' + error);
    }
  }

  async listFiles(bucket: string, prefix?: string) {
    try {
      const objects = [];
      const stream = this.minioClient.listObjectsV2(bucket, prefix, true);

      for await (const obj of stream) {
        const stat = await this.minioClient.statObject(bucket, obj.name);
        objects.push({
          name: obj.name,
          url: await this.getFileUrl(bucket, obj.name, 'public'),
          size: stat.size,
          type: stat.metaData['content-type'],
          uploadTime: stat.lastModified,
        });
      }

      return objects;
    } catch (error) {
      throw new InternalServerErrorException('文件列表获取失败！' + error);
    }
  }

  async getFileUrl(
    bucket: string,
    path: string,
    type: 'public' | 'private' = 'public',
    expiry: number = 24 * 60 * 60,
  ) {
    try {
      if (type === 'public') {
        return `/${bucket}/${path}`;
      }
      return await this.minioClient.presignedGetObject(bucket, path, expiry);
    } catch (error) {
      throw new InternalServerErrorException('URL生成失败！' + error);
    }
  }

  async deleteFile(bucket: string, path: string) {
    try {
      await this.minioClient.removeObject(bucket, path);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('文件删除失败！' + error);
    }
  }
}
