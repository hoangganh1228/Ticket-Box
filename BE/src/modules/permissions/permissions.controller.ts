import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionRoute } from '../../common/decorators/permission.decorator';
import {
  PERMISSION_CODE,
  PERMISSION_PATH,
} from '../../common/constants/permission.constant';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from 'src/common/guards/permisson.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }
  @Get()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.VIEW_ALL_PERMISSION,
    PERMISSION_PATH.PERMISSION,
    'GET',
    'View all permissions',
  )
  getGroupedRoutes() {
    return this.permissionsService.getGroupedRoutes();
  }
  // get permision event
  @Get('/event')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @PermissionRoute(
    PERMISSION_CODE.VIEW_ALL_PERMISSION_EVENT,
    PERMISSION_PATH.PERMISSION,
    'GET',
    'View all permissions event',
  )
  getEventPermissions() {
    return this.permissionsService.getEventPermissions();
  }
  @Put(':id')
  @PermissionRoute(
    PERMISSION_CODE.UPDATE_PERMISSION,
    PERMISSION_PATH.PERMISSION,
    'PUT',
    'Update permissions',
  )
  updatePermissions(
    @Param('id') id: number,
    @Body() data: { display_name: string },
  ) {
    return this.permissionsService.updatePermissions(id, data);
  }
}
