import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Orders } from 'src/database/entities/Orders';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersRepository extends BaseRepository<Orders> {
  constructor(@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,) {
    super(orderRepo);
  }

  async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async findByOrderNumber(orderNumber: string) {
    return this.repository.findOne({ where: { order_number: orderNumber } });
  }

  async findByOrderNumberWithEvent(orderNumber: string) {
    return this.repository.findOne({ where: { order_number: orderNumber }, relations: ['event'] });
  }
  async getElectronicTicket(orderNumber: string) {
    return this.repository.findOne({
      where: { order_number: orderNumber },
      relations: ['event', 'user', 'orderItems', 'orderItems.ticket', 'payments', 'event.settings'],
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        final_amount: true,
        discount_amount: true,
        user: {
          id: true,
          username: true,
          email: true,
        },
        event: {
          id: true,
          name: true,
          banner: true,
        },
        orderItems: {
          id: true,
          quantity: true,
          unit_price: true,
          total_price: true,
          ticket: {
            id: true,
            name: true,
            start_time: true,
            end_time: true,
          },
        },
        payments: {
          id: true,
          provider: true,
        },
      },
    });
  }
  flattenOrder(order: any): any {
    const flat: any = {};

    for (const key in order) {
      if (key !== 'event') {
        flat[`orders_${key}`] = order[key];
      }
    }

    if (order.event) {
      for (const key in order.event) {
        if (key !== 'shows') {
          flat[`event_${key}`] = order.event[key];
        }
      }

      if (Array.isArray(order.event.shows)) {
        const show = order.event.shows[0];
        if (show) {
          for (const key in show) {
            flat[`shows_${key}`] = show[key];
          }
        }
      }
    }

    return flat;
  }

  // get my-ticket
  async getMyTickets(
    userId: number,
    status: any,
    compareTime: string,
    date: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const qb = this.orderRepo
      .createQueryBuilder('orders')
      .innerJoin('events', 'event', 'event.id = orders.event_id')
      .innerJoin('shows', 'shows', 'shows.event_id = event.id')
      .where('orders.user_id = :userId', { userId });

    if (status && status !== 'all') {
      if (Array.isArray(status)) {
        qb.andWhere('orders.status IN (:...status)', { status });
      } else {
        qb.andWhere('orders.status = :status', { status });
      }
    }

    if (compareTime) {
      qb.andWhere(`shows.time_end ${compareTime} :date`, { date });
    }

    const total = await qb.clone().getCount();

    const offset = (page - 1) * limit;

    const data = await qb
      .clone()
      .innerJoinAndSelect('orders.event', 'event1')
      .innerJoinAndSelect('event1.shows', 'shows1')
      .orderBy('orders.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      data,
      total,
    };
  }


  async getOrderStatus(status: string, timeline: string, user: any) {

    const now = new Date();

    const query = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.event', 'event')
      .innerJoinAndSelect('event.show', 'show')
      .where('order.user_id = :userId', { userId: 3 });

    if (status !== 'all') {
      query.andWhere('order.status =:status', { status });
    }

    if (timeline === 'upcoming') {
      query.andWhere('show.time_start > :now', { now });
    } else if (timeline === 'ended') {
      query.andWhere('show.time_start < :now', { now });
    }

    return query.orderBy('show.time_start', 'ASC').getRawMany();
  }
}