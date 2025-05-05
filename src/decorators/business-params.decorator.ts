import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsNull } from 'typeorm';

export const BusinessParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const businessId = request.query.businessId ?? request.body.businessId;
    const businessKey =
      request.query?.businessKey ?? request.body?.businessKey ?? IsNull();
    return { businessId, businessKey };
  },
);
