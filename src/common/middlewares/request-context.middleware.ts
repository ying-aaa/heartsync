import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '../context/request.context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 核心：启动ALS上下文，将next()（后续请求逻辑）包裹在上下文内
    RequestContext.runWithContext(() => {
      next(); // 执行后续的拦截器、控制器逻辑
    });
  }
}
