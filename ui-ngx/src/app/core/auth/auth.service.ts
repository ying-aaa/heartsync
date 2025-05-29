// auth.service.ts
import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import Keycloak, { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { debounceTime, Subject, switchMap } from 'rxjs';

interface AuthState {
  isAuthenticated: boolean;
  status: string | undefined;
  userProfile: KeycloakProfile | undefined;
  tokenParsed: KeycloakTokenParsed | undefined;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak: Keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<AuthState>({
    isAuthenticated: false,
    status: undefined,
    userProfile: undefined,
    tokenParsed: undefined,
  });

  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly userProfile = computed(() => this.state().userProfile);

  public username = computed(() => {
    const profile = this.state().userProfile;
    return profile?.username || null;
  });

  private loadProfileTrigger = new Subject<void>();

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
          this.loadProfileTrigger.next();
          break;
        case KeycloakEventType.TokenExpired:
          this.keycloak.updateToken(30);
          break;
        case KeycloakEventType.AuthLogout:
          this.state.set({
            isAuthenticated: false,
            status: undefined,
            userProfile: undefined,
            tokenParsed: undefined,
          });
          break;
      }
    });

    this.loadProfileTrigger
      .pipe(
        debounceTime(300),
        switchMap(() => this.loadUserProfile()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((userProfile: any) => {
        if (userProfile)
          this.state.update((s) => ({
            ...s,
            userProfile,
            tokenParsed: this.keycloak.tokenParsed,
          }));
      });

    // 初始状态检查
    // this.keycloak.isLoggedIn().then((loggedIn: any) => {
    //   this.state.update(s => ({ ...s, isAuthenticated: loggedIn }));
    //   if (loggedIn) this.loadProfileTrigger.next();
    // });
  }

  private handleReady(event: any): void {
    const isAuthenticated = typeEventArgs<boolean>(event.args);
    this.state.update((s) => ({ ...s, isAuthenticated }));
    if (isAuthenticated) {
      this.loadProfileTrigger.next();
    }
  }

  private async loadUserProfile(): Promise<KeycloakProfile | null> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      return profile;
    } catch (e) {
      return null;
    }
  }

  public handleLogout(): void {
    console.log('用户已登出');
  }

  // getToken(): Promise<string | null> {
  //   return this.keycloak.token && !this.keycloak.isTokenExpired() ?
  //     Promise.resolve(this.keycloak.token) :
  //     this.keycloak.updateToken(30);
  // }

  getRoles(): string[] {
    const token = this.state().tokenParsed;
    return token?.realm_access?.roles || [];
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
