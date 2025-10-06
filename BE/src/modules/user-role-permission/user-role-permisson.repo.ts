import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Repository } from 'typeorm';
import { CategoryRepository } from '../categories/category.repo';
import { UserRolePermissions } from '../../database/entities/user_role_permissions';

@Injectable()
export class UserRolePermissionsRepository extends BaseRepository<UserRolePermissions> {
  constructor(
    @InjectRepository(UserRolePermissions)
    private readonly userRolePermissionsRepository: Repository<UserRolePermissions>,
  ) {
    super(userRolePermissionsRepository);
  }
}
