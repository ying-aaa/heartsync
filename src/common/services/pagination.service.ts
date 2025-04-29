// common/services/pagination.service.ts
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../dtos/pagination.dto';
import { PageDto } from '../dtos/page.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HsPaginationService {
  async paginate<T>(
    repository: Repository<T>,
    pageOptionsDto: PageOptionsDto,
    queryOptions: any = {},
  ): Promise<PageDto<T>> {
    const { page, pageSize, sortBy, order } = pageOptionsDto;
    const skip = page * pageSize;

    const queryBuilder = repository.createQueryBuilder('entity');

    // 添加排序
    if (sortBy && order) {
      queryBuilder.orderBy(`entity.${sortBy}`, order);
    }

    // 添加自定义查询条件
    if (queryOptions.where) {
      queryBuilder.where(queryOptions.where);
    }

    // 执行查询
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return new PageDto(
      data,
      page,
      pageSize,
      total,
      Math.ceil(total / pageSize),
    );
  }
}
