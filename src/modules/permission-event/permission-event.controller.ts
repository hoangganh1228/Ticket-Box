import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PermissionEventService } from './permission-event.service';
import { CreatePermissionEventDto } from './dto/create-permission-event.dto';
import { UpdatePermissionEventDto } from './dto/update-permission-event.dto';

@Controller('/events/permissions')
export class PermissionEventController {
  constructor(
    private readonly permissionEventService: PermissionEventService,
  ) {}
}
