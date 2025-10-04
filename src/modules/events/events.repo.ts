import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Events } from 'src/database/entities/Events';
import { Repository } from 'typeorm';
import { CategoryRepository } from '../categories/category.repo';
import { CategoryResponse } from 'src/common/interface/category-event-res.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
@Injectable()
export class EventRepository extends BaseRepository<Events> {
  constructor(
    @InjectRepository(Events) private readonly eventRepo: Repository<Events>,
    private readonly categoryRepo: CategoryRepository,
  ) {
    super(eventRepo);
  }

  // Tái sử dụng phần query SQL chung
  private initEventQueryBuilder() {
    return this.eventRepo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.settings', 'setting')
      .innerJoinAndSelect(
        'event.shows',
        'show',
        `show.time_start = (
        SELECT s.time_start
        FROM shows s
        WHERE s.event_id = event.id
          AND s.time_start > NOW()
        ORDER BY s.time_start ASC
        LIMIT 1
      )`,
      )
      .innerJoinAndSelect(
        'show.tickets',
        'ticket',
        `ticket.id = (
        SELECT t.id
        FROM tickets t
        WHERE t.show_id = show.id
        ORDER BY t.price ASC
        LIMIT 1
      )`,
      );
  }

  private async getEventsByType(options: {
    flagField: 'is_special' | 'is_trending'; // tên cột điều kiện
    title: { en: string; vi: string }; // tiêu đề cần hiển thị
  }) {
    const { flagField, title } = options;

    const events = await this.eventRepo
      .createQueryBuilder('event')
      .innerJoin('event.settings', 'settings')
      .select(['event.id', 'event.thumbnail', 'settings.link', 'settings.url'])
      .where(`event.${flagField} = :flag`, { flag: true })
      .orderBy('event.id', 'DESC')
      .getMany();

    return {
      title,
      events: events.map((event) => ({
        id: event.id,
        imageUrl: event.thumbnail,
        deeplink: event.settings[0]?.url || '',
      })),
    };
  }

  private async getEventSpecial() {
    return await this.getEventsByType({
      flagField: 'is_special',
      title: {
        en: 'Special events',
        vi: 'Sự kiện đặc biệt',
      },
    });
  }

  private async getEventTrendding() {
    return await this.getEventsByType({
      flagField: 'is_trending',
      title: {
        en: 'Trending events',
        vi: 'Sự kiện xu hướng',
      },
    });
  }

  private async getEventBigCates() {
    const events = await this.initEventQueryBuilder().getMany();

    // Nhóm events theo category
    const categoriesMap: Record<number, CategoryResponse> = {};

    events.forEach((event) => {
      const category = event.category;

      if (!categoriesMap[category.id]) {
        categoriesMap[category.id] = {
          cateId: category.id,
          code: category.name,
          title: {
            en: category.name,
            vi: category.name,
          },
          events: [],
        };
      }

      const firstShow = event.shows[0];
      const minTicket = firstShow?.tickets[0];

      categoriesMap[category.id].events.push({
        id: event.id,
        name: event.name,
        imageUrl: event.thumbnail,
        orgLogoUrl: event.org_thumbnail,
        day: firstShow?.time_start?.toISOString() ?? null,
        price: minTicket?.price ?? null,
        deeplink: event.settings[0]?.url,
        isFree: (minTicket?.price ?? 0) === 0,
      });
    });

    return Object.values(categoriesMap);
  }

  private async getEventForYou(regionName: string) {
    const events = await this.initEventQueryBuilder()
      .where('event.province LIKE :region', { region: `%${regionName}%` })
      .getMany();

    const formatted = {
      title: {
        en: 'Top picks for you',
        vi: 'Dành cho bạn',
      },
      events: events.map((event) => {
        const firstShow = event.shows[0];
        const minTicket = firstShow?.tickets[0];

        return {
          id: event.id,
          originalId: event.id,
          name: event.name,
          price: minTicket?.price ?? 0,
          isFree: (minTicket?.price ?? 0) === 0,
          imageUrl: event.thumbnail,
          orgLogoUrl: event.org_thumbnail,
          deeplink: event.settings[0]?.url,
          day: firstShow?.time_start?.toISOString() ?? null,
        };
      }),
    };

    return formatted;
  }

  async getEvents(regionName: string) {
    const [specialEvents, trenddingEvents, bigCatesEvent, onlyOnTicketbox] =
      await Promise.all([
        this.getEventSpecial(),
        this.getEventTrendding(),
        this.getEventBigCates(),
        this.getEventForYou(regionName),
      ]);
    return {
      result: {
        specialEvents,
        trenddingEvents,
        bigCates: bigCatesEvent,
        onlyOnTicketbox,
      },
      message: 'Thành Công',
      status: 1,
      traceId: '',
    };
  }

  async getEventsByWeekOrByMonth(fromDate: Date, toDate: Date): Promise<any> {
    const events = await this.eventRepo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.settings', 'setting')
      .innerJoinAndSelect(
        'event.shows',
        'show',
        `show.time_start = (
        SELECT s.time_start
        FROM shows s
        WHERE s.event_id = event.id
          AND s.time_start BETWEEN :from AND :to
        ORDER BY s.time_start ASC
        LIMIT 1
      )`,
        { from: fromDate, to: toDate },
      )
      .innerJoinAndSelect(
        'show.tickets',
        'ticket',
        `ticket.id = (
        SELECT t.id
        FROM tickets t
        WHERE t.show_id = show.id
        AND t.price > 0
        ORDER BY t.price ASC
        LIMIT 1
      )`,
      )
      .getMany();

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      slug: event.slug,
      imageUrl: event.thumbnail,
      orgLogoUrl: event.org_thumbnail,
      day: event.shows[0]?.time_start ?? '',
      price: event.shows[0]?.tickets[0]?.price ?? '',
      isFree: event.shows[0]?.tickets[0]?.is_free ?? false,
      originalId: event.id,
      deeplink: event.settings[0]?.url ?? '',
      category: event.category?.name ?? '',
    }));
  }

  //
  async getEventsBanner(): Promise<any> {
    const events = await this.initEventQueryBuilder()
      .where('event.videoUrl IS NOT NULL')
      .orderBy('event.created_at', 'DESC')
      .getMany();

    const heroBanner = events.map((event) => ({
      eventId: event.id,
      name: event.name,
      imageUrl: event.thumbnail,
      videoUrl: event.videoUrl,
      time_start: event.shows[0]?.time_start?.toISOString() ?? null,
      time_end: event.shows[0]?.time_end?.toISOString() ?? null,
      price: event.shows[0]?.tickets[0]?.price ?? null,
      deeplink: event.settings[0]?.url,
      isFree: (event.shows[0]?.tickets[0]?.price ?? 0) === 0,
    }));

    return {
      status: 1,
      message: 'Thành công',
      data: {
        result: {
          heroBanner,
        },
      },
      code: 0,
      traceId: '',
    };
  }

  async searchEvents(params: {
    q?: string;
    cate?: string;
    page: number;
    limit: number;
    skip: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<any> {
    const { q, cate, page, limit, skip, fromDate, toDate } = params;

    if (toDate) toDate.setHours(23, 59, 59, 999);

    const qb = await this.eventRepo
      .createQueryBuilder('event')
      .innerJoin('event.category', 'category')
      .innerJoin('event.settings', 'setting')
      .innerJoin(
        'event.shows',
        'show',
        `show.time_start = (
        SELECT s.time_start
        FROM shows s
        WHERE s.event_id = event.id
        ORDER BY s.time_start ASC
        LIMIT 1
    )`,
      )
      .innerJoin(
        'show.tickets',
        'ticket',
        `ticket.id = (
         SELECT t.id
         FROM tickets t
         WHERE t.show_id = show.id
         ORDER BY t.price ASC
         LIMIT 1
      )`,
      )
      .select([
        'event.id AS event_id',
        'event.name AS event_name',
        'event.thumbnail AS event_thumbnail',
        'event.banner AS event_banner',
        'event.slug AS event_slug',
        'show.id AS show_id',
        'show.time_start AS day',
        'show.time_end AS day_end',
        'ticket.id AS ticket_id',
        'ticket.price AS ticket_price',
        'ticket.is_free AS isFree',
        'setting.url AS deeplink',
      ])
      .skip(skip)
      .take(limit);
    if (q) {
      qb.where('LOWER(event.name) LIKE LOWER(:name)', { name: `%${q}%` });
    } else if (cate) {
      qb.where('category.slug = :slug', { slug: cate });
    }

    return qb.getRawMany();
  }

  async getEventDetail(id: number): Promise<any> {
    const event = await this.eventRepo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.settings', 'setting')
      .innerJoinAndSelect('event.shows', 'show')
      .innerJoinAndSelect('show.tickets', 'ticket')
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    // ---- Lấy bản ghi ticket rẻ nhất (full record) ----
    const allTickets = event.shows.flatMap((s) => s.tickets);

    //get object ticket minPrice
    const cheapestTicket = allTickets.length
      ? allTickets.reduce(
        (min, t) => (t.price < min.price ? t : min),
        allTickets[0],
      )
      : null;

    // ---- Lấy bản ghi show gần nhất (full record) : tương tự như lấy vé ----
    const now = new Date();
    const futureShows = event.shows.filter((s) => new Date(s.time_start) > now);
    const nearestShow = futureShows.length
      ? futureShows.reduce(
          (nearest, s) =>
            new Date(s.time_start) < new Date(nearest.time_start) ? s : nearest,
          futureShows[0],
        )
      : null;

    return {
      ...event,
      minTicketPrice: cheapestTicket?.price ?? null,
      isFree: cheapestTicket?.is_free,
      endTime: nearestShow?.time_start,
    };
  }

  async getEventSuggestions(id: number): Promise<any> {
    const event = await this.eventRepo.findOne({ where: { id } });

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const events = await this.initEventQueryBuilder()
      .where('event.category_id = :categoryId', {
        categoryId: event.category_id,
      })
      .andWhere('event.id != :eventId', { eventId: event.id })
      .orderBy('RAND()')
      .limit(5)
      .getMany();

    // Nhóm events theo category
    const categoriesMap: Record<number, CategoryResponse> = {};

    events.forEach((event) => {
      const category = event.category;

      if (!categoriesMap[category.id]) {
        categoriesMap[category.id] = {
          cateId: category.id,
          code: category.name,
          title: {
            en: category.name,
            vi: category.name,
          },
          events: [],
        };
      }

      const firstShow = event.shows[0];
      const minTicket = firstShow?.tickets[0];

      categoriesMap[category.id].events.push({
        id: event.id,
        name: event.name,
        imageUrl: event.thumbnail,
        orgLogoUrl: event.org_thumbnail,
        day: firstShow?.time_start?.toISOString() ?? null,
        price: minTicket?.price ?? null,
        deeplink: event.settings[0]?.url,
        isFree: (minTicket?.price ?? 0) === 0,
      });
    });

    return Object.values(categoriesMap);
  }
  async getPastEvents(userId: number, page: number, limit: number, search?: string): Promise<{ data: Events[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const now = new Date();

    const qb = this.repository.createQueryBuilder('events')
      .leftJoinAndSelect('events.shows', 'show')
      .where('events.created_by = :userId', { userId })
      .where(qb => {
        const sub = qb.subQuery()
          .select('MAX(s.time_end)', 'last_end')
          .from('shows', 's')
          .where('s.event_id = events.id')
          .getQuery();
        return `${sub} < :now`;
      }, { now })
      .orderBy('show.time_start', 'ASC')
    if (search) {
      qb.andWhere(
        '(events.name LIKE :search OR events.name_address LIKE :search OR events.district LIKE :search OR events.province LIKE :search OR events.ward LIKE :search)',
        { search: `%${search}%` }
      );
    }
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit }
  }
  async getUpcomingEvents(userId: number, page: number, limit: number, search): Promise<{ data: Events[]; total: number; }> {
    const skip = (page - 1) * limit;
    const now = new Date();

    const qb = this.eventRepo.createQueryBuilder('events')
      .leftJoinAndSelect('events.shows', 'show')
      .where('events.created_by = :userId', { userId })
      .andWhere('show.time_start > :now', { now })
      .orderBy('show.time_start', 'ASC')

    if (search) {
      qb.andWhere(
        '(events.name LIKE :search OR events.name_address LIKE :search OR events.district LIKE :search OR events.province LIKE :search OR events.ward LIKE :search)',
        { search: `%${search}%` }
      );
    }

    qb.skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
    }
  }
}


