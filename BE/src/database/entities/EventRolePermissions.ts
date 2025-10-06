import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permissions } from './Permissions';
import { EventRoles } from './EventRoles';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('event_role_permissions')
export class EventRolePermissions extends BaseEntity {
  @Column()
  event_role_id: number;

  @Column()
  permission_id: number;

  @ManyToOne(() => EventRoles, (user) => user.eventRolePermissions)
  @JoinColumn({ name: 'event_role_id' })
  eventRole: EventRoles;
  @ManyToOne(() => Permissions, { eager: true })
  @JoinColumn({ name: 'permission_id' })
  permission: Permissions;
}
