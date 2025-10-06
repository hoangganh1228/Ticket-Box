// src/modules/security/security.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { SecurityService } from './security.service';
import { VerifyTurnstileDto } from './dto/verify-turnstile.dto';

@Controller('security/turnstile')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyTurnstileDto, @Req() req: any) {
    const remoteIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      undefined;

    const { isValid } = await this.securityService.verifyTurnstile(dto.token, remoteIp);

    return {
      success: true,
      statusCode: 200,
      data: { isValid },
      message: isValid ? 'Turnstile verified' : 'Turnstile invalid',
    };
  }
}