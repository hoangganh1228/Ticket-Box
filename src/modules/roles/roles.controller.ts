import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AddOrUpdatePermissionInRoleDto } from './dto/add-or-update-permission-in-role.dto';
import { PermissionRoute } from '../../common/decorators/permission.decorator';
import { PERMISSION_CODE } from '../../common/constants/permission.constant';
import { PermissionsGuard } from '../../common/guards/permisson.guard';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(PERMISSION_CODE.LIST_ROLE, 'roles', 'get', 'Get list role')
  getAllRoles(@Query() pagination: PaginationQueryDto) {
    return this.rolesService.getAllRoles(pagination);
  }

  @Post(':id/permissions')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.ADD_OR_UPDATE_PERMISSION_IN_ROLE,
    'roles',
    'post',
    'ADD OR UPDATE PERMISSION IN ROLE',
  )
  addPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dataDto: AddOrUpdatePermissionInRoleDto,
  ) {
    return this.rolesService.addOrUpdatePermissions(id, dataDto);
  }
  @Get(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.DETAIL_ROLE,
    'roles',
    'get',
    'Get detail role',
  )
  getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.detail(id);
  }
  @Post()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.CREATE_ROLE,
    'roles',
    'post',
    'Create new role',
  )
  createRole(@Body() data: CreateRoleDto) {
    return this.rolesService.createRole(data);
  }
  @Put(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(PERMISSION_CODE.UPDATE_ROLE, 'roles', 'put', 'Update role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateRoleDto,
  ) {
    return this.rolesService.updateRole(id, data);
  }
  @Delete(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.DELETE_ROLE,
    'roles',
    'delete',
    'Delete role',
  )
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
