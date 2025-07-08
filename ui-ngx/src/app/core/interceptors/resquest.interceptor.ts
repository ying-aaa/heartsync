import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { environment } from '@environments/environment';

export const RequestInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const modifiedReq = modifyRequest(req, authService);

  return next(modifiedReq);
};

// 请求修改函数
const modifyRequest = (
  req: HttpRequest<unknown>,
  auth: AuthService,
): HttpRequest<unknown> => {
  let headers = req.headers;

  // 添加认证令牌
  const token = auth.getToken();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // 添加默认头
  // if (!headers.has('Content-Type')) {
  headers = headers.set('Content-Type', 'application/json');
  // }
  headers = headers
    // .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest');
  // .set('X-Client-Version', environment.version);

  // 处理FormData的特殊情况
  if (req.body instanceof FormData) {
    headers = headers.delete('Content-Type');
  }

  return req.clone({
    headers,
  });
};
