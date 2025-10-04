import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users';
import { Events } from './Events';
import { EventRoles } from './EventRoles';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('event_memberships')
export class EventMemberships extends BaseEntity {
  @Column()
  user_id: number;

  @Column()
  event_id: number;

  @Column()
  event_role_id: number;

  @Column({ type: 'datetime', nullable: true })
  joined_at: Date;

  @ManyToOne(() => Users, (user) => user.eventMemberships)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Events, (event) => event.eventMemberships)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @ManyToOne(() => EventRoles, (role) => role.eventMemberships)
  @JoinColumn({ name: 'event_role_id' })
  role: EventRoles;
}
