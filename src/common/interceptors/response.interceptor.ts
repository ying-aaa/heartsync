import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 统一包装响应数据
        return {
          message: '操作成功', // 默认消息
          statusCode: 200, // 默认状态码
          data: data || null, // 原始响应数据
        };
      }),
    );
  }
}
