import { BaseService } from 'src/common/base/base.service';
import { EventRepository } from './events.repo';
import axios from 'axios';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

import { Events } from 'src/database/entities/Events';
import { EventsRepository } from './repositories/events.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { CreateSettingDto } from './dto/create-setting.dto';
import { CreatePaymentEventDto } from './dto/create-payment.dto';
import { PaymentEventRepository } from './repositories/payment-event.repository';
import { ApprovalStatus } from 'src/common/enums/event.enum';
import { RedisService } from 'src/common/redis/redis.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getMyEventDto } from './dto/get-my-event.dto';
import { Like } from 'typeorm';
import { responseCustomize } from 'src/common/utils/responseCustomize';

@Injectable()
export class EventsService extends BaseService<Events> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventsRepo: EventsRepository,
    private readonly settingRepo: SettingsRepository,
    private readonly paymentRepo: PaymentEventRepository,
    private readonly redisService: RedisService, // Inject RedisService
  ) {
    super(eventRepository);
  }

  private async getLocationFromIp(
    ip: string,
  ): Promise<{ city?: string; regionName?: string; country?: string } | null> {
    try {
      const res = await axios.get(
        `http://ip-api.com/json/${ip}?fields=city,regionName,country`,
      );
      return res.data; // { city: 'Hanoi', regionName: 'Hà Nội', country: 'Vietnam' }
    } catch (err: any) {
      console.error('Error fetching location from IP:', err?.message);
      return null;
    }
  }

  async getEvents(fakeIp: string): Promise<any> {
    const location = await this.getLocationFromIp(fakeIp);
    const regionName = location?.regionName ?? '';
    return this.eventRepository.getEvents(regionName);
  }

  async getEventsByWeekOrByMonth(
    at: string,
    from: string,
    to: string,
  ): Promise<any> {
    if (!at || !from || !to) {
      throw new HttpException(
        'Missing required query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.eventRepository.getEventsByWeekOrByMonth(fromDate, toDate);
  }

  async getEventsBanner(): Promise<any> {
    return this.eventRepository.getEventsBanner();
  }

  async searchEvents(params: {
    q?: string;
    cate?: string;
    page: number;
    limit: number;
    from?: string;
    to?: string;
  }): Promise<any> {
    const { q, cate, page, limit, from, to } = params;

    const skip = (page - 1) * limit;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return this.eventRepository.searchEvents({
      q,
      cate,
      page,
      limit,
      skip,
      fromDate,
      toDate,
    });
  }

  async getEventDetail(id: number): Promise<any> {
    const cachedEvent = await this.redisService.getEvent(id);
    if (cachedEvent) {
      return cachedEvent;
    }
    const event = await this.eventRepository.getEventDetail(id);
    if(!event) throw new NotFoundException(`Event with id "${id}" not found`);
    await this.redisService.setEvent(id, event, 3600);

    return event;
  }

  async getEventSuggestions(id: number): Promise<any> {
    return await this.eventRepository.getEventSuggestions(id);
  }

  async createWithOwner(userId: number | undefined, dto: CreateEventDto) {
    // Generate unique slug using utility function
    //
    const timestamp = Date.now();
    const slug = `${dto.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}`;

    return this.create({
      ...dto,
      slug,
      created_by: userId || 1,
    });
  }

  async publish(eventId: number) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event)
      throw new NotFoundException(`Event with id "${eventId}" not found`);
    if (!event)
      throw new NotFoundException(`Event with id "${eventId}" not found`);
    event.status = ApprovalStatus.PENDING;
    return this.eventsRepo.update(eventId, event);
  }

  async findOne(id: number) {
    const event = await this.eventsRepo.findById(id);
    if(!event) throw new NotFoundException(`Event with id "${id}" not found`);
    return event;
  }

  findBySlug(slug: string) {
    return this.eventsRepo.findBySlug(slug);
  }

  async updateBySlug(slug: string, updateEventDto: UpdateEventDto) {
    const event = await this.findBySlug(slug);
    if (!event)
      throw new NotFoundException(`Event with slug "${slug}" not found`);
    Object.assign(event, updateEventDto);
    return this.eventsRepo.update(event.id, updateEventDto as Partial<Events>);
  }

  async deleteBySlug(slug: string) {
    const event = await this.findBySlug(slug);
    if (!event)
      throw new NotFoundException(`Event with slug "${slug}" not found`);
    return this.eventsRepo.delete(event.id);
  }

  // Override base methods to use slugs
  async update(id: number, dto: Partial<Events>) {
    return super.update(id, dto);
  }

  async remove(id: number) {
    return super.delete(id);
  }

  async createSetting(eventId: number, dto: CreateSettingDto) {
    await this.eventsRepo.findById(eventId);

    const existingSetting = await this.settingRepo.findOne({
      where: { event_id: eventId },
    });
    if (existingSetting) {
      const checkUrlExists = await this.settingRepo.findOne({
        where: { url: dto.url },
      });
      if (checkUrlExists && checkUrlExists.id !== existingSetting.id) {
        throw new HttpException(
          'URL already exists for another setting',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.settingRepo.update(existingSetting.id, {
        ...dto,
        event_id: eventId,
        updated_at: new Date(),
      });
      return this.settingRepo.findOne({
        where: { id: existingSetting.id },
      });
    } else {
      const checkUrlExists = await this.settingRepo.findOne({
        where: { url: dto.url },
      });
      if (checkUrlExists) {
        throw new HttpException(
          'URL already exists for another setting',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.settingRepo.create({
        ...dto,
        event_id: eventId,
      });
    }
  }

  async getSettings(eventId: number) {
    await this.eventsRepo.findById(eventId);
    return this.settingRepo.findByEventId(eventId);
  }

  async createPaymentInfo(eventId: number, dto: CreatePaymentEventDto) {
    await this.eventsRepo.findById(eventId);

    const existingPayment = await this.paymentRepo.findOne({
      where: { event_id: eventId },
    });

    if (existingPayment) {
      await this.paymentRepo.update(existingPayment.id, {
        ...dto,
        event_id: eventId,
        updated_at: new Date(),
      });

      return this.paymentRepo.findOne({
        where: { id: existingPayment.id },
      });
    } else {
      return this.paymentRepo.create({
        ...dto,
        event_id: eventId,
      });
    }
  }

  async getPaymentInfo(eventId: number) {
    await this.eventsRepo.findById(eventId);
    return this.paymentRepo.findByEventId(eventId);
  }

  async getDraftEvents(userId, pagination: PaginationQueryDto) {
    const { page, limit, search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    let whereConditions: any = {
      status: ApprovalStatus.DRAFT,
      created_by: userId,
    };
    if (search) {
      whereConditions = [
        { ...whereConditions, name: Like(`%${search}%`) },
        { ...whereConditions, name_address: Like(`%${search}%`) },
        { ...whereConditions, district: Like(`%${search}%`) },
        { ...whereConditions, province: Like(`%${search}%`) },
        { ...whereConditions, ward: Like(`%${search}%`) },
      ];
    }
    const [data, total] = await this.eventsRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      where: whereConditions,
    });
    return responseCustomize(data, total, pageNumber, limitNumber);
  }

  async getUpcomingEvents(userId, pagination: PaginationQueryDto) {
    const { page, limit, search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    const { data, total } = await this.eventRepository.getUpcomingEvents(userId, pageNumber, limitNumber, search);
    return responseCustomize(data, total, pageNumber, limitNumber);
  }

  async getPastEvents(userId: number, pagination: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    const { data, total } = await this.eventRepository.getPastEvents(userId, pageNumber, limitNumber, search);
    return responseCustomize(data, total, pageNumber, limitNumber);
  }

  async getPendingEvents(userId, pagination: PaginationQueryDto) {
    const { page, limit, search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);

    let where: any = {
      status: ApprovalStatus.PENDING,
      created_by: userId,
    };

    if (search) {
      where = [
        { ...where, name: Like(`%${search}%`) },
        { ...where, name_address: Like(`%${search}%`) },
        { ...where, district: Like(`%${search}%`) },
        { ...where, province: Like(`%${search}%`) },
        { ...where, ward: Like(`%${search}%`) },
      ];
    }

    const [data, total] = await this.eventsRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      where,
    });

    return responseCustomize(data, total, pageNumber, limitNumber);
  }

  async getMyEvents(
    userId: number,
    pagination: PaginationQueryDto,
    type: getMyEventDto,
  ) {
    switch (type.type) {
      case 'draft':
        return this.getDraftEvents(userId, pagination);
      case 'pending':
        return this.getPendingEvents(userId, pagination);
      case 'upcoming':
        return this.getUpcomingEvents(userId, pagination);
      case 'past':
        return this.getPastEvents(userId, pagination);
      default:
        return this.getPendingEvents(userId, pagination);
    }
  }
}
