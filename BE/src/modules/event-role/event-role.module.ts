import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRoleService } from './event-role.service';
import { EventRoleController } from './event-role.controller';
import { EventRoles } from '../../database/entities/EventRoles';
import { EventRoleRepository } from './event-role.repository';
import { EventRolePermissionModule } from '../event-role-permission/event-role-permission.module';
import { EventMembershipModule } from '../event-membership/event-membership.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRoles]),
    EventRolePermissionModule,
    forwardRef(() => EventMembershipModule), 
    RolesModule,
    UserModule,
    PermissionsModule
  ],
  controllers: [EventRoleController],
  providers: [EventRoleService, EventRoleRepository],
  exports: [EventRoleService],
})
export class EventRoleModule { }