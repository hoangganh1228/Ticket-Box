import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Repository } from 'typeorm';
import { Roles } from '../../database/entities/Roles';

@Injectable()
export class RoleRepo extends BaseRepository<Roles> {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {
    super(rolesRepository);
  }
  async checkPermissionUser(
    userId: number,
    routerCode: string,
  ): Promise<boolean> {
    const result = await this.rolesRepository
      .createQueryBuilder('roles')
      .innerJoin('users', 'U', 'U.role_id = roles.id')
      .innerJoin('user_role_permissions', 'UP', 'U.role_id = UP.role_id')
      .innerJoin('permissions', 'P', 'P.id = UP.permission_id')
      .where('U.id = :userId', { userId: userId })
      .andWhere('P.route_code = :routerCode', {
        routerCode: routerCode,
      })
      .groupBy('P.id')
      .getOne();
    return !!result;
  }
}
