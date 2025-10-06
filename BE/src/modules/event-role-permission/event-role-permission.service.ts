import { Injectable } from '@nestjs/common';
import { CreateEventRolePermissionDto } from './dto/create-event-role-permission.dto';
import { BaseService } from '../../common/base/base.service';
import { EventRolePermissionRepository } from './event-role-permission.repository';
import { EventRolePermissions } from '../../database/entities/EventRolePermissions';
import { PermissionEventService } from '../permission-event/permission-event.service';
import { UpdateEventRolePermissionDto } from './dto/update-event-role-permission.dto';
import { Permissions } from 'src/database/entities/Permissions';

@Injectable()
export class EventRolePermissionService extends BaseService<EventRolePermissions> {
  constructor(
    private readonly eventRolePermissionRepo: EventRolePermissionRepository,
    private readonly permissionEventService: PermissionEventService,
  ) {
    super(eventRolePermissionRepo);
  }
  // async createOrUpdateEventRolePermissions(
  //   eventRoleId: string,
  //   createEventRolePermissionDto: CreateEventRolePermissionDto,
  // ): Promise<void> {
  //   const { permissionIds } = createEventRolePermissionDto;
  //
  //   const checkedPermissionIds =
  //     await this.permissionEventService.findByIds(permissionIds);
  //   if (checkedPermissionIds.length !== permissionIds.length) {
  //     throw new Error('Some permission IDs do not exist');
  //   }
  //
  //   const existingPermissionIds = (
  //     await super.findAll({
  //       where: { event_role_id: +eventRoleId },
  //     })
  //   ).map((perm) => perm.permission_id);
  //
  //   // Determine permissions to insert
  //   const insertPermissions = permissionIds.filter((id) => !existingPermissionIds.includes(id));
  //   if (insertPermissions.length) {
  //     await this.eventRolePermissionRepo.insertMany(
  //       insertPermissions.map((permissionId) => ({
  //         event_role_id: +eventRoleId,
  //         permission_id: permissionId,
  //       })),
  //     );
  //   }
  //
  //   const deletePermissions = existingPermissionIds.filter((id) => !permissionIds.includes(id));
  //   if (deletePermissions.length) {
  //     await this.eventRolePermissionRepo.deleteByEventRoleIdAndPermissionId(+eventRoleId, deletePermissions);
  //   }
  // }
  async getUserEventPermissions(userId: number, eventId: number): Promise<string[]> {
    return this.eventRolePermissionRepo.getUserEventPermissions(userId, eventId);
  }
  async getEventRolePermissionsByEventRoleId(eventRoleId: string): Promise<Permissions[]> {
    const permissions = await this.eventRolePermissionRepo.findAll({
      where: { event_role_id: +eventRoleId },
      relations: ['permission', 'eventRole'],
    });
    return permissions.map((permission) => permission.permission);
  }
}
