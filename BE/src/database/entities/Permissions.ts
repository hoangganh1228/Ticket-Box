import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Roles } from './Roles';
import { UserRolePermissions } from './user_role_permissions';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('permissions')
export class Permissions extends BaseEntity {

  @Column({ length: 255, nullable: true, unique: true })
  route_code: string;

  @Column({ length: 255, nullable: true})
  path: string;

  @Column({ length: 255, nullable: true })
  method: string;

  @Column({ length: 255, nullable: true })
  display_name: string;

  @ManyToMany(() => Roles, (role) => role.userRolePermissions)
  roles: Roles[];
  @OneToMany(
    () => UserRolePermissions,
    (userRolePermissions) => userRolePermissions.permission,
  )
  userRolePermissions: UserRolePermissions[];
}
