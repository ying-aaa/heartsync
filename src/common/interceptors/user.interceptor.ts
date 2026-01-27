import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { KeycloakUser, RequestContext } from '../context/request.context';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<any>();

    if (request.user) {
      const keycloakUser: KeycloakUser = {
        id: request.user.sub, // Keycloak用户唯一标识
        username: request.user.preferred_username,
        email: request.user.email,
        department: request.user.department || request.user['department'], // 自定义属性（需在Keycloak中配置）
      };

      RequestContext.setCurrentUser(keycloakUser);
    }

    return next.handle();
  }
}
