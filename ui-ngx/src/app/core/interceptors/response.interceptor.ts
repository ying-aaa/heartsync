import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export function ResponentInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const toastrService: ToastrService = inject(ToastrService);
  const authService: AuthService = inject(AuthService);

  console.log(`[${req.method}] ${req.urlWithParams}`);

  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event.type === HttpEventType.Response) {
        const response = event as HttpResponse<unknown>;

        // 根据状态码进行不同处理
        switch (response.status) {
          case 200: // OK
            return handleSuccessResponse(response);

          case 201: // Created
            console.log('Resource created:', response.headers.get('Location'));
            return response.clone({
              body: (response.body as any)?.data,
            });

          case 204: // No Content
            console.log('Request succeeded with no content');
            return response;

          default:
            return response;
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // 统一错误处理
      return handleError(error, { toastrService, authService });
    }),
  );
}

// 成功响应处理
function handleSuccessResponse(response: HttpResponse<unknown>): HttpResponse<unknown> {
  // 示例：处理标准化响应结构
  const body = response.body as { data?: unknown; message?: string };

  // 克隆响应并处理body
  const newResponse = response.clone({
    body: body?.data ?? response.body,
  });

  // 如果有成功消息则记录
  if (body?.message) {
    const url = response.url || '';
    const startIndex = url.indexOf('/api') + 1; // 找到指定字符的索引，并加1跳过该字符
    console.log(`%c 🍑 ${url.substring(startIndex)}`, 'color:#6ec1c2', body.message);
  }

  return newResponse;
}

// 增强的错误处理
function handleError(
  error: HttpErrorResponse,
  {
    toastrService,
    authService,
  }: {
    toastrService: ToastrService;
    authService: AuthService;
  },
): Observable<never> {
  const errorMessage = error.error?.message || error.error?.error || error.message;

  toastrService.error(errorMessage);

  switch (error.status) {
    case 400: // Bad Request
      console.error('Validation Error:', error.error);
      break;

    case 401: // Unauthorized
      console.warn('Authentication expired, redirecting...');
      // 这里可以加入重定向逻辑
      // router.navigate(['/login']);
      toastrService.error('当前登录已过期，请重新登录。');

      // setTimeout(() => {
      //   authService.login();
      // }, 800);
      break;

    case 403: // Forbidden
      console.error('Permission denied:', errorMessage);
      break;

    case 404: // Not Found
      console.error('Resource not found:', error.url);
      break;

    case 429: // Too Many Requests
      console.warn('Rate limit exceeded, retrying...');
      // 可以加入重试逻辑
      break;

    case 500: // Internal Server Error
      console.error('Server Error:', error.error);
      break;

    default:
      console.error(`Unknown Error [${error.status}]:`, error);
  }

  // 返回统一错误格式
  return throwError(() => ({
    status: error.status,
    message: errorMessage,
    timestamp: new Date().toISOString(),
  }));
}
