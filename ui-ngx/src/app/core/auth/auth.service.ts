import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { UserService } from './user.service'; // 导入新的用户服务

interface AuthState {
  isAuthenticated: boolean;
  status: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly userService = inject(UserService); // 注入用户服务

  private readonly state = signal<AuthState>({
    isAuthenticated: false,
    status: undefined,
  });

  readonly isAuthenticated = computed(() => this.state().isAuthenticated);

  readonly nickname = computed(() => this.userService.nickname());

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      const status = keycloakEvent.type;
      this.state.update((s) => ({ ...s, status }));

      switch (status) {
        case KeycloakEventType.Ready:
          this.handleReady(keycloakEvent);
          break;
        case KeycloakEventType.AuthSuccess:
          this.state.update((s) => ({ ...s, isAuthenticated: true }));
          this.userService.loadProfileTrigger.next();
          break;
        case KeycloakEventType.TokenExpired:
          this.keycloak.updateToken(30);
          break;
        case KeycloakEventType.AuthLogout:
          this.state.set({
            isAuthenticated: false,
            status: undefined,
          });
          this.userService.clearUser(); // 使用用户服务清除信息
          localStorage.removeItem('access_token');
          break;
      }
    });
  }

  private handleReady(event: any): void {
    const isAuthenticated = typeEventArgs<boolean>(event.args);
    this.state.update((s) => ({ ...s, isAuthenticated }));
    if (isAuthenticated) {
      localStorage.setItem('access_token', this.getToken()!);
      this.userService.loadProfileTrigger.next();
    }
  }

  getToken() {
    return this.keycloak.token;
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
