import { IsArray, IsNotEmpty } from 'class-validator';

export class AddOrUpdatePermissionInRoleDto {
  @IsNotEmpty()
  @IsArray()
  permissionIds: number[];
}
