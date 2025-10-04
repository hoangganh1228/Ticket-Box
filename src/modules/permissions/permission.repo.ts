import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { In, Repository } from 'typeorm';
import { Permissions } from '../../database/entities/Permissions';

@Injectable()
export class PermissionRepo extends BaseRepository<Permissions> {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
  ) {
    super(permissionsRepository);
  }
  getAllPermissionGroupBypath() {
    return this.permissionsRepository
      .createQueryBuilder('permissions')
      .select('permissions.path', 'path')
      .addSelect('ARRAY_AGG(permissions.route_code)', 'route_codes')
      .addSelect('ARRAY_AGG(permissions.method)', 'methods')
      .addSelect('ARRAY_AGG(permissions.display_name)', 'display_names')
      .groupBy('permissions.path')
      .getRawMany();
  }
  async findByIds(ids: number[]): Promise<Permissions[]> {
    return await this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

}
