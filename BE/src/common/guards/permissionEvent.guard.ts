import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventRolePermissionService } from 'src/modules/event-role-permission/event-role-permission.service';
import { JwtPayload } from 'src/modules/auth/types/jwt-payload';
import { EventsService } from 'src/modules/events/events.service';
import { PermissionMetadata } from '../interfaces/permission.interface';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { EventMembershipService } from 'src/modules/event-membership/event-membership.service';

@Injectable()
export class PermissionEventGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly eventRolePermissionService: EventRolePermissionService,
    private readonly eventService: EventsService,
    private readonly eventMemberShipService: EventMembershipService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routerCode = this.reflector.getAllAndOverride<PermissionMetadata>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<{ user: JwtPayload; params?: any; body?: any }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authorized');
    }

    const eventId = request.params?.eventId || request.body?.eventId || request.params?.id;
    if (!eventId) {
      throw new ForbiddenException('Event ID is missing');
    }

    if (await this.isEventOwner(eventId, user.sub)) {
      return true;
    }

    const roleId = await this.getUserRoleInEvent(eventId, user.sub);
    if (!roleId) {
      throw new ForbiddenException('You are not a member of this event');
    }

    const hasPermission = await this.hasPermissionInEvent(roleId, routerCode.routeCode);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission for this action');
    }

    return true;
  }

  private async isEventOwner(eventId: number, userId: number): Promise<boolean> {
    const events = await this.eventService.findAll({
      where: { id: +eventId, created_by: userId },
    });
    return events.length > 0;
  }

  private async getUserRoleInEvent(eventId: number, userId: number): Promise<number | null> {
    const membership = await this.eventMemberShipService.findOneOptions({
      where: { event_id: +eventId, user_id: userId },
    });
    return membership ? membership.event_role_id : null;
  }

  private async hasPermissionInEvent(roleId: number, routeCode: string): Promise<boolean> {
    const permissions = await this.eventRolePermissionService.findAll({
      where: { event_role_id: roleId },
    });
    const permissionCodes = permissions.map((p) => p.permission.route_code);
    return permissionCodes.includes(routeCode);
  }
}
