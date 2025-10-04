import { Injectable } from '@nestjs/common';
import { CreateUserRolePermissionDto } from './dto/create-user-role-permission.dto';
import { UpdateUserRolePermissionDto } from './dto/update-user-role-permission.dto';

@Injectable()
export class UserRolePermissionService {
  create(createUserRolePermissionDto: CreateUserRolePermissionDto) {
    return 'This action adds a new userRolePermission';
  }

  findAll() {
    return `This action returns all userRolePermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRolePermission`;
  }

  update(id: number, updateUserRolePermissionDto: UpdateUserRolePermissionDto) {
    return `This action updates a #${id} userRolePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRolePermission`;
  }
}
