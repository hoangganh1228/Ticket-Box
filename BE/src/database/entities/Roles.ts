import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRolePermissions } from './user_role_permissions';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('roles')
export class Roles extends BaseEntity {
  @Column({ length: 255, nullable: true })
  code: string;

  @Column({ length: 255, nullable: true })
  display_name: string;

  @OneToMany(
    () => UserRolePermissions,
    (userRolePermissions) => userRolePermissions.role,
  )
  userRolePermissions: UserRolePermissions[];
}
