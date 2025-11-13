import { Module } from '@nestjs/common';
import { KeycloakConfigService } from './keycloak-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [KeycloakConfigService],
  exports: [KeycloakConfigService],
  imports: [ConfigModule],
})
export class KeycloakModule {}
