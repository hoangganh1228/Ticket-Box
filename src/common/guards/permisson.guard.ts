import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { JwtPayload } from '../../modules/auth/types/jwt-payload';
import { RolesService } from '../../modules/roles/roles.service';
import { PermissionMetadata } from '../interfaces/permission.interface';
import { isAdminOrSuperAdmin } from '../helpers/role';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routerCode = this.reflector.getAllAndOverride<PermissionMetadata>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!routerCode) return true;
    const request = context
      .switchToHttp()
      .getRequest<{ user: JwtPayload; params?: any; body?: any }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Not authorized');
    }
    const user_id = user.sub;
    const userData = await this.userService.findById(user_id);
    const role = await this.roleService.findById(userData.role_id);
    if (isAdminOrSuperAdmin(role.code)) return true;
    return await this.roleService.checkPermissionUser(
      user_id,
      routerCode?.routeCode,
    );
  }
}
