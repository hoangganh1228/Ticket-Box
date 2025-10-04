import { EventRolePermissionRepository } from './../event-role-permission/event-role-permission.repository';
import { Injectable } from '@nestjs/common';
import { CreateEventRoleDto } from './dto/create-event-role.dto';
import { BaseService } from '../../common/base/base.service';
import { EventRoleRepository } from './event-role.repository';
import { EventRoles } from '../../database/entities/EventRoles';
import { UpdateEventRoleDto } from './dto/update-event-role.dto';
import { generateCode } from '../../common/helpers/generate';
import { EventMembershipRepository } from '../event-membership/event-membership.repository';
import { PermissionRepo } from '../permissions/permission.repo';
import { CreateOrUpdatePermissionInRoleEventDTO } from './dto/create-or-update-permission-in-role-evemt';

@Injectable()
export class EventRoleService extends BaseService<EventRoles> {
  constructor(
    private readonly eventRoleRepo: EventRoleRepository,
    private readonly eventRolePermissionRepo: EventRolePermissionRepository,
    private readonly eventMemberShipRepo: EventMembershipRepository,
    private readonly permissionRepo: PermissionRepo
  ) {
    super(eventRoleRepo);
  }

  async create(createEventRoleDto: CreateEventRoleDto) {
    const { display_name } = createEventRoleDto;
    const code = generateCode(display_name);
    const checkDisplayNameExists = await this.eventRoleRepo.findOne({
      where: { display_name },
    });
    if (checkDisplayNameExists) {
      throw new Error(
        `Event role with display name ${display_name} already exists.`,
      );
    }
    const checkCodeExists = await this.eventRoleRepo.findOne({
      where: { code },
    });
    if (checkCodeExists) {
      throw new Error(`Event role with code ${code} already exists.`);
    }
    createEventRoleDto.code = code;
    return this.eventRoleRepo.create(createEventRoleDto);
  }

  async update(id: number, updateEventRoleDto: UpdateEventRoleDto) {
    const { display_name } = updateEventRoleDto;
    const code = generateCode(display_name);
    const checkDisplayNameExists = await this.eventRoleRepo.findOne({
      where: { display_name },
    });
    if (checkDisplayNameExists && checkDisplayNameExists.id !== id) {
      throw new Error(
        `Event role with display name ${display_name} already exists.`,
      );
    }
    const checkCodeExists = await this.eventRoleRepo.findOne({
      where: { code },
    });
    if (checkCodeExists && checkCodeExists.id !== id) {
      throw new Error(`Event role with code ${code} already exists.`);
    }
    updateEventRoleDto.code = code;
    return this.eventRoleRepo.update(id, updateEventRoleDto);
  }

  async findAllEventRole() {
    const eventRoles = await this.eventRoleRepo.findAll({
      relations: ['eventRolePermissions'],
    });

    return eventRoles.map(({ eventRolePermissions, ...role }) => ({
      ...role,
      eventRolePermissions: eventRolePermissions.map(
        ({ permission }) => permission,
      ),
    }));
  }

  async detail(id: number) {
    const eventRole = await this.eventRoleRepo.findOne({ where: { id } });
    if (!eventRole) {
      throw new Error(`Event role with id ${id} does not exist.`);
    }
    return eventRole;
  }

  async remove(id: number) {
    const eventRole = await this.eventRoleRepo.findOne({ where: { id } });
    if (!eventRole) {
      throw new Error(`Event role with id ${id} does not exist.`);
    }
    await this.eventRolePermissionRepo.deleteByEventRoleId(id);
    await this.eventMemberShipRepo.deleteByEventRoleId(id);

    return this.eventRoleRepo.delete(id);
  }
  async getPermissionsOfEventRole(id: number) {
    const eventRole = await this.eventRoleRepo.findOne({ where: { id } });
    if (!eventRole) {
      throw new Error(`Event role with id ${id} does not exist.`);
    }
    const eventRolePermissions = await this.eventRolePermissionRepo.findAll({
      where: { event_role_id: id },
      relations: ['permission'],
    });
    return eventRolePermissions.map((erp) => erp.permission);
  }
  async addOrUpdatePermissions(id: number, dto: CreateOrUpdatePermissionInRoleEventDTO) {
    const { permissionIds } = dto;
    const checkedPermissionIds =
      await this.permissionRepo.findByIds(permissionIds);
    if (checkedPermissionIds.length !== permissionIds.length) {
      throw new Error('Some permission IDs do not exist');
    }

    const existingPermissionIds = (
      await this.eventRolePermissionRepo.findAll({
        where: { event_role_id: +id },
      })
    ).map((perm) => perm.permission_id);

    // Determine permissions to insert
    const insertPermissions = permissionIds.filter((id) => !existingPermissionIds.includes(id));
    if (insertPermissions.length) {
      await this.eventRolePermissionRepo.insertMany(
        insertPermissions.map((permissionId) => ({
          event_role_id: +id,
          permission_id: permissionId,
        })),
      );
    }

    const deletePermissions = existingPermissionIds.filter((id) => !permissionIds.includes(id));
    if (deletePermissions.length) {
      await this.eventRolePermissionRepo.deleteByEventRoleIdAndPermissionId(+id, deletePermissions);
    }
  }
}
