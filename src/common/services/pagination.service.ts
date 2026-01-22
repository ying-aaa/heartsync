// common/services/pagination.service.ts
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../dtos/pagination.dto';
import { PageDto } from '../dtos/page.dto';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

@Injectable()
export class HsPaginationService {
  async paginate<T>(
    repoOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    pageOptionsDto: PageOptionsDto,
    alias: string = 'entity',
  ): Promise<PageDto<T>> {
    const { page, pageSize, sortBy, order } = pageOptionsDto;
    const skip = page * pageSize;

    let queryBuilder: SelectQueryBuilder<T>;

    if (repoOrQueryBuilder instanceof Repository) {
      queryBuilder = repoOrQueryBuilder.createQueryBuilder(alias);

      if (sortBy && order) {
        queryBuilder.orderBy(`${alias}.${sortBy}`, order);
      }

      const where = omit(pageOptionsDto, [
        'page',
        'pageSize',
        'sortBy',
        'order',
      ]);
      if (Object.keys(where).length > 0) {
        queryBuilder.where(where);
      }
    } else {
      queryBuilder = repoOrQueryBuilder;
    }

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
