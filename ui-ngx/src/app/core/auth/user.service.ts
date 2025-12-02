import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Keycloak, { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly keycloak = inject(Keycloak);
  private readonly destroyRef = inject(DestroyRef);

  // 用户状态信号
  private readonly state = signal<{
    userProfile: KeycloakProfile | undefined;
    tokenParsed: KeycloakTokenParsed | undefined;
  }>({
    userProfile: undefined,
    tokenParsed: undefined,
  });

  // 计算属性
  readonly userProfile = computed(() => this.state().userProfile);
  readonly tokenParsed = computed(() => this.state().tokenParsed);
  readonly username = computed(() => {
    console.log('this.userProfile()', this.userProfile());
    const firstName = this.userProfile()?.firstName;
    const lastName = this.userProfile()?.lastName;
    return (firstName || '') + (lastName || '') || this.userProfile()?.username || '';
  });
  readonly roles = computed(() => this.tokenParsed()?.realm_access?.roles || []);
  public loadProfileTrigger = new Subject<void>();

  constructor() {
    this.loadProfileTrigger
      .pipe(
        debounceTime(300),
        switchMap(() => this.loadUserProfile()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((profile: any) => {
        console.log('profile', profile);
        if (profile) {
          // 使用用户服务更新信息
          this.updateUser(profile, this.keycloak.tokenParsed);
        }
      });
  }

  getUserId(): string | undefined {
    return (this.keycloak.tokenParsed as any)?.sub;
  }

  private async loadUserProfile(): Promise<KeycloakProfile | null> {
    try {
      this.keycloak.loadUserInfo().then((userInfo) => {});
      return await this.keycloak.loadUserProfile();
    } catch {
      return null;
    }
  }

  // 更新用户信息
  updateUser(profile: KeycloakProfile | undefined, tokenParsed: KeycloakTokenParsed | undefined) {
    this.state.update((s) => ({ ...s, userProfile: profile, tokenParsed }));
  }

  // 清除用户信息
  clearUser() {
    this.state.set({ userProfile: undefined, tokenParsed: undefined });
  }
}
