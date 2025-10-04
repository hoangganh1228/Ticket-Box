import { Roles } from '../constants/roles.constant';

export const isAdminOrSuperAdmin = (roleCode: string): boolean =>
  roleCode === Roles.SUPER_ADMIN || roleCode === Roles.ADMIN;
