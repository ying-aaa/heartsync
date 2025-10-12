import { Injectable } from '@nestjs/common';

/**
 * 根据前端传入的参数，生成数据库表结构
 * 传递：
 * 1、几张表，每张表的表名 建立内部维护（考虑已有表里加入）
 * 2、关联关系 内部维护
 * 2、表对应关系 建立内部维护
 * 3、每张表字段 字段可以被多个表单或列表所使用
 */

@Injectable()
export class SchemaService {}
