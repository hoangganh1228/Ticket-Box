import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventRoleService } from './event-role.service';
import { CreateEventRoleDto } from './dto/create-event-role.dto';
import { UpdateEventRoleDto } from './dto/update-event-role.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from 'src/common/guards/permisson.guard';
import { PermissionRoute } from 'src/common/decorators/permission.decorator';
import { PERMISSION_CODE, PERMISSION_PATH } from 'src/common/constants/permission.constant';
import { CreateOrUpdatePermissionInRoleEventDTO } from './dto/create-or-update-permission-in-role-evemt';

@Controller('/event-role/roles')
export class EventRoleController {
  constructor(private readonly eventRoleService: EventRoleService) { }

  @Post()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.CREATE_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'POST',
    'Create event role',
  )
  create(@Body() createEventRoleDto: CreateEventRoleDto) {
    return this.eventRoleService.create(createEventRoleDto);
  }
  @Put(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.UPDATE_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'PUT',
    'Update event role',
  )
  update(
    @Param('id') id: string,
    @Body() updateEventRoleDto: UpdateEventRoleDto,
  ) {
    return this.eventRoleService.update(+id, updateEventRoleDto);
  }
  @Get()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.VIEW_ALL_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'GET',
    'Get all event role',
  )
  findAll() {
    return this.eventRoleService.findAllEventRole();
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.GET_DETAIL_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'GET',
    'Get detail event role',
  )
  findOne(@Param('id') id: string) {
    return this.eventRoleService.detail(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.DELETE_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'DELETE',
    'Delete event role',
  )
  remove(@Param('id') id: string) {
    return this.eventRoleService.remove(+id);
  }
  @Get(':id/permissions')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.VIEW_PERMISSION_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'GET',
    'Get permissions of event role',
  )
  getPermissions(@Param('id') id: string) {
    return this.eventRoleService.getPermissionsOfEventRole(+id);
  }
  @Post(':id/permissions')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.ADD_OR_UPDATE_PERMISSION_IN_ROLE_EVENT,
    PERMISSION_PATH.EVENT_ROLE,
    'POST',
    'Add or update permissions in event role',
  )
  addOrUpdatePermissions(
    @Param('id') id: string,
    @Body() permissionIds: CreateOrUpdatePermissionInRoleEventDTO,
  ) {
    return this.eventRoleService.addOrUpdatePermissions(+id, permissionIds);
  }
}
