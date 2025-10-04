import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload';
import { Request } from 'express';
import { StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refresh_token || null,             // get refresh_token from cookie
      ]),
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);                            // Decode token and check, if it pass call validate function
  }

  validate(req: Request, payload: JwtPayload) {
    const rt = req.cookies?.refresh_token;
    if (!rt) throw new UnauthorizedException('Missing refresh token');
    return payload;    // attach to req.user
  }
}