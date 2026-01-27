import { AsyncLocalStorage } from 'node:async_hooks';

export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  department?: string;
  [key: string]: any;
}

interface RequestContextStore {
  user?: KeycloakUser;
}

// 创建ALS实例
const als = new AsyncLocalStorage<RequestContextStore>();

export class RequestContext {
  /**
   * 启动上下文（核心：必须先调用这个方法，才能set/get用户信息）
   * @param callback 要在上下文内执行的逻辑（如处理请求）
   */
  static runWithContext<T>(callback: () => T): T {
    // 初始化空上下文，启动ALS
    return als.run({}, callback);
  }

  /**
   * 设置当前上下文的用户信息
   */
  static setCurrentUser(user: KeycloakUser): void {
    const store = als.getStore();
    if (store) {
      store.user = user;
    } else {
      // 调试日志：帮助定位上下文未初始化的问题（大型项目建议保留）
      console.warn('❌ 尝试设置用户信息，但ALS上下文未初始化！');
    }
  }

  /**
   * 获取当前上下文的用户信息
   */
  static getCurrentUser(): KeycloakUser | undefined {
    return als.getStore()?.user;
  }
}
