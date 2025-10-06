// src/modules/security/security.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  imports: [ConfigModule],
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {}