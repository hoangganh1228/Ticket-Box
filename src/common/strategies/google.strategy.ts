import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/modules/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private auth: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
      scope: ['email', 'profile'],
    });
  }


  //phương thức này được thực thi sau khi gg trả về thông tin người dùng
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const hashedPassword = await bcrypt.hash(profile.emails[0].value, 10);
    const user = await this.auth.validateGoogleUser({ email: profile.emails[0].value, username: profile.displayName })
    done(null, user);
  }
}
