import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../enums/eventPermission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const CheckPermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
