import { forwardRef, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from '../../database/entities/Permissions';
import { DiscoveryModule, Reflector } from '@nestjs/core';
import { PermissionRepo } from './permission.repo';
import { RolesModule } from '../roles/roles.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissions]), 
    DiscoveryModule,
    forwardRef(() => RolesModule),
    forwardRef(() => UserModule),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, Reflector, PermissionRepo],
  exports: [PermissionRepo],
})
export class PermissionsModule { }
