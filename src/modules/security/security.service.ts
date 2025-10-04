// src/modules/security/security.service.ts
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private readonly configService: ConfigService) {}

  async verifyTurnstile(token: string, remoteIp?: string) {
    const secret = this.configService.get<string>('security.turnstileSecretKey');
    if (!secret) {
      this.logger.error('TURNSTILE_SECRET_KEY is missing');
      return { isValid: false, cf: null };
    }

    try {
      const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const params = new URLSearchParams();
      params.append('secret', secret);
      params.append('response', token);
      if (remoteIp) params.append('remoteip', remoteIp);

      const { data } = await axios.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 5000,
        validateStatus: () => true,
      });

      // Cloudflare response: { success: boolean, 'error-codes': string[], ... }
      const isValid = Boolean(data?.success);
      return { isValid, cf: data };
    } catch (e) {
      this.logger.error('verifyTurnstile error', e as any);
      return { isValid: false, cf: null };
    }
  }
}