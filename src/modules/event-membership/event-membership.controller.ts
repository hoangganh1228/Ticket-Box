import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventMembershipService } from './event-membership.service';
import { CreateEventMembershipDto } from './dto/create-event-membership.dto';
import { UpdateEventMembershipDto } from './dto/update-event-membership.dto';
import { PermissionRoute } from '../../common/decorators/permission.decorator';
import {
  PERMISSION_CODE,
  PERMISSION_PATH,
} from '../../common/constants/permission.constant';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionEventGuard } from 'src/common/guards/permissionEvent.guard';

@Controller('/events/:eventId/memberships')
export class EventMembershipController {
  constructor(
    private readonly eventMembershipService: EventMembershipService,
  ) { }
  /* get all members in event */
  @Get()
  @PermissionRoute(
    PERMISSION_CODE.VIEW_ALL_MEMBER_EVENT,
    PERMISSION_PATH.MEMBER_EVENT,
    'GET',
    'View all members in event',
  )
  findAll(
    @Param('eventId') eventId: string,
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.eventMembershipService.getAllMembershipsByEventId(
      eventId,
      role,
      page,
      limit,
    );
  }
  /* add member */
  @Post()
  @UseGuards(JwtAccessGuard, PermissionEventGuard)
  @PermissionRoute(
    PERMISSION_CODE.INVITE_MEMBER_EVENT,
    PERMISSION_PATH.EVENT_PERMISSION,
    'POST',
    'Invite member to event',
  )
  create(
    @Param('eventId') eventId: string,
    @Body() createEventMembershipDto: CreateEventMembershipDto,
  ) {
    return this.eventMembershipService.createMembership(
      eventId,
      createEventMembershipDto,
    );
  }
  /* remove member */
  @Delete(':userId')
  remove(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventMembershipService.removeMembership(eventId, +userId);
  }
  /* update member */
  @Put()
  update(
    @Param('eventId') eventId: string,
    @Body() updateEventMembershipDto: UpdateEventMembershipDto,
  ) {
    return this.eventMembershipService.updateMembership(
      eventId,
      updateEventMembershipDto,
    );
  }
}
