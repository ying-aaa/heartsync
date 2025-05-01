// common/services/pagination.service.ts
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../dtos/pagination.dto';
import { PageDto } from '../dtos/page.dto';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

@Injectable()
export class HsPaginationService {
  async paginate<T>(
    repository: Repository<T>,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<T>> {
    const { page, pageSize, sortBy, order } = pageOptionsDto;
    const skip = page * pageSize;

    const queryBuilder = repository.createQueryBuilder('entity');

    // 添加排序
    if (sortBy && order) {
      queryBuilder.orderBy(`entity.${sortBy}`, order);
    }

    const where = omit(pageOptionsDto, ['page', 'pageSize', 'sortBy', 'order']);

    queryBuilder.where(where);

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
