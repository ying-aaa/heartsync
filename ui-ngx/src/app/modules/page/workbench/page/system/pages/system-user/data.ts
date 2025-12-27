import { IUserRequiredAction } from '@src/app/shared/models/user.model';

export const userRequiredCtions: Array<{
  providerId: string;
  label: string;
}> = [
  {
    providerId: 'CONFIGURE_TOTP',
    label: '配置一次性密码',
  },
  {
    providerId: 'TERMS_AND_CONDITIONS',
    label: '条款与条件',
  },
  {
    providerId: 'UPDATE_PASSWORD',
    label: '更新密码',
  },
  {
    providerId: 'UPDATE_PROFILE',
    label: '更新个人资料',
  },
  {
    providerId: 'VERIFY_EMAIL',
    label: '验证电子邮件',
  },
  {
    providerId: 'delete_account',
    label: '删除账户',
  },
  {
    providerId: 'webauthn-register',
    label: 'WebAuthn 注册',
  },
  {
    providerId: 'webauthn-register-passwordless',
    label: 'WebAuthn 无密码注册',
  },
{
    providerId: 'VERIFY_PROFILE',
    label: '验证个人资料',
  },
  {
    providerId: 'delete_credential',
    label: '删除凭据',
  },
  {
    providerId: 'update_user_locale',
    label: '更新用户地区设置',
  },
];
