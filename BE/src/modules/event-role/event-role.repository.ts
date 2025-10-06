import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { EventRoles } from '../../database/entities/EventRoles';

@Injectable()
export class EventRoleRepository extends BaseRepository<EventRoles> {
  constructor(@InjectRepository(EventRoles) repo: Repository<EventRoles>) {
    super(repo);
  }
}
