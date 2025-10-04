import { forwardRef, Module } from '@nestjs/common';
import { EventMembershipService } from './event-membership.service';
import { EventMembershipController } from './event-membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventMemberships } from 'src/database/entities/EventMemberships';
import { EventMembershipRepository } from './event-membership.repository';
import { EventsModule } from '../events/events.module';
import { EventRoleModule } from '../event-role/event-role.module';
import { EventRolePermissionModule } from '../event-role-permission/event-role-permission.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventMemberships]),
    forwardRef(() => EventsModule),
    UserModule,
    forwardRef(() => EventRoleModule),
    forwardRef(() => EventRolePermissionModule),
  ],
  controllers: [EventMembershipController],
  providers: [EventMembershipService, EventMembershipRepository],
  exports: [EventMembershipService, EventMembershipRepository],
})
export class EventMembershipModule { }
