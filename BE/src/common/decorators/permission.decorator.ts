import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissionRole';
export const PermissionRoute = (
  routeCode: string,
  path: string,
  method: string,
  display_name: string,
) => SetMetadata(PERMISSION_KEY, { routeCode, path, method, display_name });
