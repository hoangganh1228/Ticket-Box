import { Injectable, Query } from '@nestjs/common';
import { BaseService } from '../../common/base/base.service';
import { Roles } from '../../database/entities/Roles';
import { RoleRepo } from './role.repo';
import { In, Like } from 'typeorm';
import { PermissionRepo } from '../permissions/permission.repo';
import { AddOrUpdatePermissionInRoleDto } from './dto/add-or-update-permission-in-role.dto';
import { UserRolePermissionsRepository } from '../user-role-permission/user-role-permisson.repo';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { responseCustomize } from '../../common/utils/responseCustomize';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRepository } from '../user/user.repo';

@Injectable()
export class RolesService extends BaseService<Roles> {
  constructor(
    private readonly roleRepo: RoleRepo,
    private readonly permissionRepo: PermissionRepo,
    private readonly userRolePermissionsRepository: UserRolePermissionsRepository,
    private readonly userRepo: UserRepository,
  ) {
    super(roleRepo);
  }
  async getAllRoles(pagination: PaginationQueryDto) {
    const { page, limit, order = 'ASC', sortBy = 'id', search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);

    const whereConditions: any = {};
    if (search) {
      whereConditions.display_name = Like(`%${search}%`);
    }

    const [data, total] = await this.roleRepo.findAndCount({
      order: { [sortBy]: order },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      where: whereConditions,
    });
    return responseCustomize(data, total, pageNumber, limitNumber);
  }
  async addOrUpdatePermissions(
    id: number,
    dataDto: AddOrUpdatePermissionInRoleDto,
  ) {
    const { permissionIds } = dataDto;
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['userRolePermissions'],
    });
    if (!role) {
      throw new Error('Role not found');
    }
    const checkedPermissions = await this.permissionRepo.findAll({
      where: { id: In(permissionIds) },
    });
    if (checkedPermissions.length !== permissionIds.length) {
      throw new Error('Some permissions not found');
    }
    const existingPermissionIds = role.userRolePermissions.map(
      ({ permission_id }) => permission_id,
    );
    const newPermissionIds = permissionIds.filter(
      (pid) => !existingPermissionIds.includes(pid),
    );
    if (newPermissionIds.length) {
      const newPermissions = newPermissionIds.map((pid) => ({
        role_id: id,
        permission_id: pid,
      }));
      await this.userRolePermissionsRepository.save(newPermissions);
    }
    const removedPermissionIds = existingPermissionIds.filter(
      (pid) => !permissionIds.includes(pid),
    );
    if (removedPermissionIds.length) {
      await this.userRolePermissionsRepository.deleteMany({
        role_id: id,
        permission_id: In(removedPermissionIds),
      });
    }
    return this.roleRepo.findOne({
      where: { id },
      relations: ['userRolePermissions', 'userRolePermissions.permission'],
    });
  }
  async detail(id: number) {
    const roles = await this.roleRepo.findOne({
      where: { id },
      relations: ['userRolePermissions', 'userRolePermissions.permission'],
    });
    if (!roles) {
      throw new Error('Role not found');
    }
    return {
      ...roles,
      userRolePermissions: roles.userRolePermissions.map(
        (urp) => urp.permission,
      ),
    };
  }

  async checkPermissionUser(
    userId: number,
    routerCode: string,
  ): Promise<boolean> {
    return this.roleRepo.checkPermissionUser(userId, routerCode);
  }
  async createRole(data: CreateRoleDto) {
    const { display_name } = data;
    const existingRole = await this.roleRepo.findOne({
      where: { display_name },
    });
    if (existingRole) throw new Error('Role already exists');
    const roleCode = display_name
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');

    return this.roleRepo.create({ ...data, code: roleCode });
  }
  async updateRole(id: number, data: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }

    const { display_name } = data;
    if (display_name && display_name !== role.display_name) {
      const existingRole = await this.roleRepo.findOne({
        where: { display_name },
      });
      if (existingRole) {
        throw new Error('Role already exists');
      }
    }

    await this.roleRepo.update(id, data);
    return this.roleRepo.findOne({ where: { id } });
  }
  async deleteRole(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new Error('Role not found');

    const isRoleAssigned = await this.userRepo.count({
      where: { role_id: role.id },
    });
    if (isRoleAssigned > 0)
      throw new Error('Cannot delete role assigned to users');

    await this.userRolePermissionsRepository.deleteMany({ role_id: id });
    return this.roleRepo.delete(id);
  }
}
