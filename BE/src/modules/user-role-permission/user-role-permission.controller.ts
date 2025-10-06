import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRolePermissionService } from './user-role-permission.service';
import { CreateUserRolePermissionDto } from './dto/create-user-role-permission.dto';
import { UpdateUserRolePermissionDto } from './dto/update-user-role-permission.dto';

@Controller('user-role-permission')
export class UserRolePermissionController {
  constructor(private readonly userRolePermissionService: UserRolePermissionService) {}

  @Post()
  create(@Body() createUserRolePermissionDto: CreateUserRolePermissionDto) {
    return this.userRolePermissionService.create(createUserRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.userRolePermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolePermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRolePermissionDto: UpdateUserRolePermissionDto) {
    return this.userRolePermissionService.update(+id, updateUserRolePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolePermissionService.remove(+id);
  }
}
