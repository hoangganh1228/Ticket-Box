import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './Roles';
import { Permissions } from './Permissions';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('user_role_permissions')
export class UserRolePermissions extends BaseEntity {
  @Column()
  permission_id: number;

  @Column()
  role_id: number;

  @ManyToOne(() => Roles, (role) => role.userRolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Roles;
  @ManyToOne(
    () => Permissions,
    (permission) => permission.userRolePermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permissions;
}
