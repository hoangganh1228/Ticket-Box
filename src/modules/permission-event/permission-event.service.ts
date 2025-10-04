import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaseService } from '../../common/base/base.service';
import { PermissionEventRepository } from './permission-event.repository';
import { generateCode } from '../../common/helpers/generate';
import { CreatePermissionEventDto } from './dto/create-permission-event.dto';
import { UpdatePermissionEventDto } from './dto/update-permission-event.dto';
import { Permissions } from '../../database/entities/Permissions';

@Injectable()
export class PermissionEventService
  extends BaseService<Permissions>
  implements OnModuleInit
{
  constructor(private readonly permissionEventRepo: PermissionEventRepository) {
    super(permissionEventRepo);
  }
  async onModuleInit() {}
}
