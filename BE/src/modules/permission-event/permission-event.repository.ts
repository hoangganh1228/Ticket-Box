import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Permissions } from '../../database/entities/Permissions';

@Injectable()
export class PermissionEventRepository extends BaseRepository<Permissions> {
  constructor(
    @InjectRepository(Permissions) repo: Repository<Permissions>,
  ) {
    super(repo);
  }
  async findByIds(ids: number[]): Promise<Permissions[]> {
    return await this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

}
