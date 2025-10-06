import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleOAuthGuard } from 'src/common/guards/google-auth.guard';
import { vnpConfig } from 'src/config/vnpay.config';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
  ) { }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/login')
  googleLogin() {
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleCallBack(@Req() req: any, @Res() res: Response) {

    console.log(2);
    const user = req.user
    const { access_token, refresh_token } = await this.auth.signTokens(user);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${vnpConfig.frontend_Success_Url}/auth?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }

  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(dto.email, dto.password);

    const { access_token, refresh_token } = this.auth.signTokens(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token, refresh_token, user };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const payload = req.user;
    const { access_token, refresh_token } = this.auth.signTokens({
      id: payload.sub,
      email: payload.email,
    } as any);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token };
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { success: true };
  }
}