import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export enum DB_TYPES {
  Mysql = 'mysql',
  Postgres = 'postgres',
  Sqlserver = 'sqlserver',
}

export class CreateDataSourceDto {
  @ApiProperty({ description: '数据源名称（唯一）', example: 'prod-mysql' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '数据库类型',
    enum: DB_TYPES,
    example: 'mysql',
  })
  @IsEnum(DB_TYPES)
  type: 'mysql' | 'postgres' | 'sqlserver';

  @ApiProperty({ description: '数据库主机', example: '192.168.1.100' })
  @IsIP()
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({
    description: '数据库端口',
    example: 3306,
    minimum: 1,
    maximum: 65535,
  })
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

  @ApiProperty({ description: '目标库名', example: 'order_db' })
  @IsString()
  @IsNotEmpty()
  database: string;

  @ApiProperty({ description: '登录用户名', example: 'root' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '登录密码（明文，后端加密后落库）',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '客户端字符集', example: 'utf8' })
  @IsString()
  @IsOptional()
  clientCharset?: string;

  @ApiProperty({ description: '数据库字符集', example: 'utf8' })
  @IsString()
  @IsOptional()
  dataBaseCharset?: string;

  @ApiProperty({ description: '最小连接数', example: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  minPoolCount?: number;

  @ApiProperty({ description: '最大连接数', example: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxPoolCount?: number;
}
