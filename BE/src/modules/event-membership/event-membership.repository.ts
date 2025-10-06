import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { EventMemberships } from 'src/database/entities/EventMemberships';

@Injectable()
export class EventMembershipRepository extends BaseRepository<EventMemberships> {
  constructor(
    @InjectRepository(EventMemberships) repo: Repository<EventMemberships>,
  ) {
    super(repo);
  }
  async deleteByEventRoleId(eventRoleId: number): Promise<void> {
    await this.repository.delete({ event_role_id: eventRoleId });
  }
}
