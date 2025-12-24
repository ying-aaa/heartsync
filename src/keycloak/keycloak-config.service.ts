import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    console.log(
      '%c Line:14 🥤',
      'color:#fca650',
      this.configService.get('KC_CLIENT_SECRET'),
    );
    return {
      authServerUrl: this.configService.get('KC_AUTO_SERVER_URL'),
      realm: this.configService.get('KC_REALM'),
      clientId: this.configService.get('KC_CLIENT_ID'),
      secret: this.configService.get('KC_CLIENT_SECRET'),
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      // tokenValidation: TokenValidation.ONLINE,
      tokenValidation: TokenValidation.OFFLINE,
      useNestLogger: true,
    };
  }
}
