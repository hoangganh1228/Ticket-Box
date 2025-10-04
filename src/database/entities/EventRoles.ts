import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventMemberships } from './EventMemberships';
import { EventRolePermissions } from './EventRolePermissions';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('event_roles')
export class EventRoles extends BaseEntity {
  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 255, unique: true, nullable: true })
  display_name: string;

  @OneToMany(() => EventMemberships, (membership) => membership.role)
  eventMemberships: EventMemberships[];
  @OneToMany(() => EventRolePermissions, (permission) => permission.eventRole)
  eventRolePermissions: [];
}
