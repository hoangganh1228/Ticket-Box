import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionRepo } from './permission.repo';
import { PERMISSION_KEY } from '../../common/decorators/permission.decorator';
import { In, Like } from 'typeorm';
import { PermissionMetadata } from '../../common/interfaces/permission.interface';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { responseCustomize } from '../../common/utils/responseCustomize';
import { PERMISSION_PATH } from 'src/common/constants/permission.constant';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(
    private readonly permissionRepo: PermissionRepo,
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
  ) { }
  async onModuleInit() {
    const controllers = this.discoveryService.getControllers();

    const permissions: PermissionMetadata[] = [];
    for (const wrapper of controllers) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { instance } = wrapper;
      if (!instance) continue;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const prototype = Object.getPrototypeOf(instance);
      const methods = Object.getOwnPropertyNames(prototype).filter(
        (method) => method !== 'constructor',
      );

      for (const method of methods) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const handler = prototype[method];
        const metadata: PermissionMetadata = this.reflector.get(
          PERMISSION_KEY,
          handler,
        );
        if (metadata) {
          permissions.push(metadata);
        }
      }
    }
    const routeCodes = permissions
      .map((p) => p.routeCode)
      .filter((code): code is string => !!code);

    const listPermissions = await this.permissionRepo.findAll({
      where: { route_code: In(routeCodes) },
    });

    const newPermissions = permissions.filter(
      (p) => !listPermissions.some((lp) => lp.route_code === p.routeCode),
    );
    if (newPermissions.length > 0) {
      const formattedPermissions = newPermissions.map(
        ({ routeCode, path, method, display_name }) => ({
          route_code: routeCode,
          path,
          method,
          display_name,
        }),
      );

      await this.permissionRepo.save(formattedPermissions);
    }
  }
  async getGroupedRoutes() {

    const data = await this.permissionRepo.findAll()

    const groupedRoutes = data.reduce(
      (acc, { id, route_code, path, method, display_name }) => {
        if (!acc[path]) {
          acc[path] = { path, permissions: [] };
        }
        acc[path].permissions.push({
          id,
          route_code,
          path,
          method,
          display_name,
        });
        return acc;
      },
      {},
    );
    const groupedRoutesObj = Object.values(groupedRoutes);
    return groupedRoutesObj;
  }
  async updatePermissions(id: number, data: { display_name: string }) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new Error('Permission not found');
    }
    permission.display_name = data.display_name;
    return this.permissionRepo.save(permission);
  }
  async getEventPermissions() {
    const data = await this.permissionRepo.findAll({
      where: { path: PERMISSION_PATH.EVENT_PERMISSION },
    });
    return data;
  }
}
