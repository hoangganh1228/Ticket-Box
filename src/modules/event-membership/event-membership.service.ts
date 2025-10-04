import { Injectable } from '@nestjs/common';
import { CreateEventMembershipDto } from './dto/create-event-membership.dto';
import { EventMemberships } from 'src/database/entities/EventMemberships';
import { BaseService } from 'src/common/base/base.service';
import { EventMembershipRepository } from './event-membership.repository';
import { EventsService } from '../events/events.service';
import { EventRoleService } from '../event-role/event-role.service';
import { UpdateEventMembershipDto } from './dto/update-event-membership.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class EventMembershipService extends BaseService<EventMemberships> {
  constructor(
    private readonly eventMembershipRepo: EventMembershipRepository,
    private readonly eventService: EventsService,
    private readonly userService: UserService,
    private readonly eventRoleService: EventRoleService,
  ) {
    super(eventMembershipRepo);
  }
  async getAllMembershipsByEventId(
    eventId: string,
    role?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: EventMemberships[];
    pagination: { totalItem: number; currentPage: number; totalPage: number };
  }> {
    if (role && role !== 'all') {
      return await this.eventMembershipRepo.paginate(
        {
          where: { event_id: +eventId, event_role_id: +role },
          relations: ['user', 'role'],
        },
        { page, limit },
      );
    }
    return this.eventMembershipRepo.paginate(
      {
        where: { event_id: +eventId },
        relations: ['user', 'role'],
      },
      {
        page,
        limit,
      },
    );
  }
  async createMembership(
    eventId: string,
    createEventMembershipDto: CreateEventMembershipDto,
  ): Promise<EventMemberships | null> {
    const { event_role_id, email } = createEventMembershipDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} does not exist.`);
    }
    const user_id = user.id;
    const checkMembershipExists = await this.eventMembershipRepo.findOne({
      where: {
        event_id: +eventId,
        user_id: +user_id,
      },
    });
    if (checkMembershipExists) {
      throw new Error(`User is already a member of event`);
    }
    const eventExists = await this.eventService.findById(+eventId);
    if (!eventExists) {
      throw new Error(`Event with id ${eventId} does not exist.`);
    }
    const userExists = await this.userService.findById(+user_id);
    if (!userExists) {
      throw new Error(`User with id ${user_id} does not exist.`);
    }
    const eventRoleExists =
      await this.eventRoleService.findById(+event_role_id);
    if (!eventRoleExists) {
      throw new Error(`Event role with id ${event_role_id} does not exist.`);
    }

    createEventMembershipDto.joined_at = new Date();
    const dataCreate = await this.eventMembershipRepo.create({
      ...createEventMembershipDto,
      user_id: +user_id,
      event_id: +eventId,
    });
    const { id } = dataCreate;
    return await this.eventMembershipRepo.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
  }
  async updateMembership(
    eventId: string,
    updateEventMembershipDto: UpdateEventMembershipDto,
  ): Promise<EventMemberships | null> {
    const { user_id, event_role_id } = updateEventMembershipDto;
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new Error(`User does not exist.`);
    }
    const membership = await this.eventMembershipRepo.findOne({
      where: { event_id: +eventId, user_id: +user_id },
    });
    if (!membership) {
      throw new Error(
        `Membership not found for user ${user_id} in event ${eventId}`,
      );
    }
    if (event_role_id) {
      const eventRoleExists =
        await this.eventRoleService.findById(+event_role_id);
      if (!eventRoleExists) {
        throw new Error(`Event role with id ${event_role_id} does not exist.`);
      }
      membership.event_role_id = +event_role_id;
    }
    await this.eventMembershipRepo.update(membership.id, membership);
    return await this.eventMembershipRepo.findOne({
      where: { id: membership.id },
      relations: ['user', 'role'],
    });
  }
  async removeMembership(eventId: string, userId: number): Promise<void> {
    const membership = await this.eventMembershipRepo.findOne({
      where: { user_id: userId, event_id: +eventId },
    });
    if (!membership) {
      throw new Error(`Membership not found in event ${eventId}`);
    }
    await this.eventMembershipRepo.delete(membership.id);
  }
}
