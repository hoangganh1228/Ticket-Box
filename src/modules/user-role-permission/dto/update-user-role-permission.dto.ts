import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRolePermissionDto } from './create-user-role-permission.dto';

export class UpdateUserRolePermissionDto extends PartialType(CreateUserRolePermissionDto) {}
