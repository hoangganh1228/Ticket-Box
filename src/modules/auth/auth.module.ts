import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';
import { RolesModule } from '../roles/roles.module';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';

@Module({
  imports: [UserModule, JwtModule.register({}), RolesModule],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports : [AuthService],
})
export class AuthModule { }