import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload';
import { Users } from 'src/database/entities/Users';
import { UserService } from '../user/user.service';
import { RoleRepo } from '../roles/role.repo';
import { generateSlug } from 'src/common/utils/slug.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwt: JwtService,
    private readonly roleRepo: RoleRepo
  ) { }

  async validateUser(email: string, pass: string): Promise<Users> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signTokens(user: Users) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '365d',
    });
    const refresh_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '365d',
    });
    return { access_token, refresh_token };
  }

  async register(dto: { email: string; password: string; username?: string }) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = await this.roleRepo.findOne({ where: { code: 'user' } });
    if (!role) {
      throw new UnauthorizedException('Default role not found');
    }
    const slug = generateSlug(dto.email.split('@')[0]);
    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role_id: role.id,
      username: dto.username || dto.email.split('@')[0],
      slug,
    });
    return newUser;
  }


  async validateGoogleUser(googleUser: any) {
    const { email, username } = googleUser;

    const user = await this.usersService.findByEmail(googleUser.email)
    if (user) return user;
    return await this.register({ email, password: email, username });
  }
}