import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repo';
import { Users } from 'src/database/entities/Users';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class UserService extends BaseService<Users> {

  constructor(private readonly userRepo: UserRepository) {
    super(userRepo);
  }
  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async uploadProfile(userId: number, avatarPath: string | null, body: any) {
    return this.userRepo.uploadProfile(userId, avatarPath, body);
  }
}
