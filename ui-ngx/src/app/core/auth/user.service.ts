import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Keycloak, { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { debounceTime, forkJoin, Subject, switchMap } from 'rxjs';
import { AuthHttpService } from '../http/auth.http.service';
import { IKeycloakProfile } from '@src/app/shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly keycloak = inject(Keycloak);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authHttpService = inject(AuthHttpService);

  // 用户状态信号
  private readonly state = signal<{
    userProfile: IKeycloakProfile | undefined;
    tokenParsed: KeycloakTokenParsed | undefined;
  }>({
    userProfile: undefined,
    tokenParsed: undefined,
  });

  // 计算属性
  readonly userProfile = computed(() => this.state().userProfile);
  readonly tokenParsed = computed(() => this.state().tokenParsed);
  readonly username = computed(() => this.userProfile()?.username);
  readonly nickname = computed(() => {
    console.log('this.userProfile()', this.userProfile());
    const firstName = this.userProfile()?.firstName;
    const lastName = this.userProfile()?.lastName;
    return (firstName || '') + (lastName || '') || this.userProfile()?.username || '';
  });
  readonly email = computed(() => this.userProfile()?.email);
  readonly avatar = computed(() => (this.userProfile()?.attributes?.['avatar'] as string[])?.[0]);
  readonly phoneNumber = computed(
    () => (this.userProfile()?.attributes?.['phoneNumber'] as string[])?.[0],
  );
  readonly description = computed(
    () => (this.userProfile()?.attributes?.['description'] as string[])?.[0],
  );
  readonly jobNumber = computed(
    () => (this.userProfile()?.attributes?.['jobNumber'] as string[])?.[0],
  );
  readonly groupsPaths = computed(() => this.userProfile()?.groups?.map((g) => g.path)[0]);
  readonly roles = computed(() => this.tokenParsed()?.realm_access?.roles[0]);

  public loadProfileTrigger = new Subject<void>();

  constructor() {
    this.loadProfileTrigger
      .pipe(
        debounceTime(300),
        switchMap(() =>
          forkJoin([this.loadUserProfile(), this.authHttpService.getAuthUserGroups()]),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([profile, groups]: any) => {
        console.log('profile, groups', profile, groups);
        if (profile) {
          profile.groups = groups;
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
  updateUser(profile: IKeycloakProfile | undefined, tokenParsed: KeycloakTokenParsed | undefined) {
    this.state.update((s) => ({ ...s, userProfile: profile, tokenParsed }));
  }

  // 清除用户信息
  clearUser() {
    this.state.set({ userProfile: undefined, tokenParsed: undefined });
  }
}
