import { Injectable, NotFoundException } from '@nestjs/common';
import { Tickets } from 'src/database/entities/Tickets';
import { TicketsRepository } from './tickets.repository';
import { BaseService } from 'src/common/base/base.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class TicketsService extends BaseService<Tickets> {
  constructor(
    private readonly ticketsRepo: TicketsRepository,
    private readonly redisService: RedisService
  ) {
    super(ticketsRepo);
  }

  async findOne(id: number): Promise<Tickets> {
    const cacheKey = `ticket:${id}`;
    const cached = await this.redisService.get<Tickets>(cacheKey);
    if (cached) {
      return cached;
    }

    const ticket = await this.ticketsRepo.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

}
