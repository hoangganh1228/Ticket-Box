import { Module } from '@nestjs/common';
import { PermissionEventService } from './permission-event.service';
import { PermissionEventController } from './permission-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from '../../database/entities/Permissions';
import { PermissionEventRepository } from './permission-event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions])],
  controllers: [PermissionEventController],
  providers: [PermissionEventService, PermissionEventRepository],
  exports: [PermissionEventService, PermissionEventRepository],
})
export class PermissionEventModule {}
