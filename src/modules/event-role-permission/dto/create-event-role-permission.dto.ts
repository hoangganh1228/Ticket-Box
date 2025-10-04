import { IsArray } from 'class-validator';

export class CreateEventRolePermissionDto {
  @IsArray()
  permissionIds: number[];
}
