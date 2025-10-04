import { Module } from '@nestjs/common';
import { UserRolePermissionService } from './user-role-permission.service';
import { UserRolePermissionController } from './user-role-permission.controller';
import { UserRolePermissionsRepository } from './user-role-permisson.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolePermissions } from '../../database/entities/user_role_permissions';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolePermissions])],
  controllers: [UserRolePermissionController],
  providers: [UserRolePermissionService, UserRolePermissionsRepository],
  exports: [UserRolePermissionsRepository],
})
export class UserRolePermissionModule {}
