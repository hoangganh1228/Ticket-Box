import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { EventRolePermissions } from '../../database/entities/EventRolePermissions';

@Injectable()
export class EventRolePermissionRepository extends BaseRepository<EventRolePermissions> {
  constructor(
    @InjectRepository(EventRolePermissions)
    repo: Repository<EventRolePermissions>,
  ) {
    super(repo);
  }
  async insertMany(entities: any[]): Promise<InsertResult> {
    return await this.repository.insert(entities);
  }
  async deleteByEventRoleId(eventRoleId: number): Promise<void> {
    await this.repository.delete({
      event_role_id: eventRoleId,
    });
  }
  async deleteByEventRoleIdAndPermissionId(
    eventRoleId: number,
    permissionIds: number[],
  ): Promise<void> {
    await this.repository.delete({
      event_role_id: eventRoleId,
      permission_id: In(permissionIds),
    });
  }
  async getUserEventPermissions(userId: number, eventId: number): Promise<string[]> {
    const qb = this.repository.createQueryBuilder('erp')
      .select('p.code', 'code')
      .innerJoin('event_roles', 'er', 'er.id = erp.event_role_id')
      .innerJoin('event_memberships', 'em', 'em.event_role_id = er.id')
      .innerJoin('permission_event', 'p', 'p.id = erp.permission_id')
      .where('em.user_id = :userId', { userId })
      .andWhere('em.event_id = :eventId', { eventId });

    const result: { code: string }[] = await qb.getRawMany();
    return result.map((r) => r.code);
  }
}
