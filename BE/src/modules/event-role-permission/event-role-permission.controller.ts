import { Controller, Post, Body, Param, Put, UseGuards, Get } from '@nestjs/common';
import { EventRolePermissionService } from './event-role-permission.service';
import { CreateEventRolePermissionDto } from './dto/create-event-role-permission.dto';
import { UpdateEventRolePermissionDto } from './dto/update-event-role-permission.dto';
import { PermissionCode } from '../../common/enums/eventPermission.enum';
import { CheckPermissions } from '../../common/decorators/permissionEvent.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('/events/roles/:eventRoleId/permissions')
export class EventRolePermissionController {
  constructor(
    private readonly eventRolePermissionService: EventRolePermissionService,
  ) { }
  @UseGuards(JwtAccessGuard)
  @CheckPermissions(PermissionCode.SCAN_TICKET)
  @Put()
  update(
    @Param('eventRoleId') eventRoleId: string,
    @Body() createEventRolePermissionDto: UpdateEventRolePermissionDto,
  ) {
    // return this.eventRolePermissionService.updateEventRolePermissions(
    //   eventRoleId,
    //   createEventRolePermissionDto,
    // );
  }
  @Get()
  getEventRolePermissionsByEventRoleId(
    @Param('eventRoleId') eventRoleId: string,
  ) {
    return this.eventRolePermissionService.getEventRolePermissionsByEventRoleId(eventRoleId);
  }
}
