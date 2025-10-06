import { Injectable, BadRequestException, NotFoundException, Logger, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Orders } from 'src/database/entities/Orders';
import { OrderItems } from 'src/database/entities/OrderItems';
import { Tickets } from 'src/database/entities/Tickets';
import { RedisService } from 'src/common/redis/redis.service';
import { ORDER_STATUS } from 'src/common/enums/order_status.enum';
import { BookingItemDto, CreateBookingDto } from './dto/create-booking.dto';
import { ShowsRepository } from '../shows/shows.repository';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/common/enums/payment.enum';
import { Payments } from 'src/database/entities/Payments';
import { ReservationStatus } from 'src/common/enums/reservation_status';
import { generateOrderNumber } from 'src/common/helpers/generate';
import { handleReservationError } from 'src/common/utils/reservation.util';
import { TTL } from 'src/common/enums/ttl.enum';
import { TicketsRepository } from '../tickets/tickets.repository';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly ticketsRepo: TicketsRepository,
    private readonly showsRepo: ShowsRepository,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  async getInfoShow(showId: number) {
    const cachedShow = await this.redisService.getShow(showId);
    if (cachedShow) {
      return cachedShow;
    }
    const show = await this.showsRepo.findOneById(showId);
    if(show) {
      await this.redisService.setShow(showId, show, 3600);
    }
    return show;
  }

  async createBooking(userId: number, dto: CreateBookingDto, userEmail: string) {
    this.logger.log(`🎫 Processing booking for user ${userId}, event ${dto.event_id}`);
    try {
      const reservationResult = await this.reserveTicketsForBooking(userId, dto.items);
      if (reservationResult.status !== 'SUCCESS') {
        handleReservationError(reservationResult);
      }

      const orderNumber = generateOrderNumber();

      const bookingData = {
        orderNumber,
        userId,
        items: dto.items,
        totalAmount: this.calculateTotalAmount(dto.items),
        discountAmount: dto.discount_amount,
        finalAmount: this.calculateTotalAmount(dto.items) - dto.discount_amount,
        eventId: dto.event_id,
        status: 'RESERVED',
        email: userEmail,
        reservedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      };

        // Step 4: Store booking status in Redis
      await this.redisService.set(`order:${orderNumber}`, bookingData, TTL.BOOKING);

      return {
        status: 'RESERVED',
        orderNumber,
        message: 'Tickets reserved successfully. Processing your booking...',
        expiresAt: bookingData.expiresAt
      };

    } catch (error) {
      this.logger.error(`❌ Error creating booking:`, error);
      throw error;
    }
  }

  private async reserveTicketsForBooking(userId: number, items: BookingItemDto[]){
    const reservations = [] as Array<{
      ticketId: number;
      quantity: number;
      status: string;
    }>;
    for (const item of items) {
      const inventoryExists = await this.redisService.exists(`ticket:${item.ticket_id}:available`);
      if (!inventoryExists) {
        const ticket = await this.ticketsRepo.getTicketById(item.ticket_id);
        if (!ticket) {
          throw new NotFoundException(`Ticket with ID ${item.ticket_id} not found`);
        }
        await this.redisService.initializeTicketInventory(item.ticket_id, ticket.total_ticket);
      }

      const reservationResult = await this.redisService.reserveTickets(
        item.ticket_id,
        userId,
        item.quantity,
        TTL.BOOKING // 5 minutes lock
      );

      reservations.push({
        ticketId: item.ticket_id,
        quantity: item.quantity,
        status: reservationResult.status
      });

      if (reservationResult.status !== 'SUCCESS') {
        return {
          status: reservationResult.status as ReservationStatus,
          message: `Failed to reserve ticket ${item.ticket_id}: ${reservationResult.message}`,
          reservations
        };
      }
    }

    return {
      status: ReservationStatus.SUCCESS,
      message: 'All tickets reserved successfully',
      reservations
    };
  }

  private calculateTotalAmount(items: BookingItemDto[]): number {
    return items.reduce((total, item) => {
      return total + (item.unit_price * item.quantity);
    }, 0);
  }

  async processBookingFromQueue(bookingData: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      const existingOrder = await queryRunner.manager.findOne(Orders, {
        where: { order_number: bookingData.orderNumber },
      });
  
      if (existingOrder) {
        this.logger.warn(`⚠️ Order ${bookingData.orderNumber} already exists, skipping creation`);
        await queryRunner.commitTransaction();
        return;
      }

      const order = await queryRunner.manager.save(Orders, {
        order_number: bookingData.orderNumber,
        user_id: bookingData.userId,
        total_amount: bookingData.totalAmount,
        discount_amount: bookingData.discountAmount || 0,
        final_amount: bookingData.finalAmount,
        status: ORDER_STATUS.PENDING,
        event_id: bookingData.eventId,
        email: bookingData.email,
        expires_at: new Date(bookingData.expiresAt),
        created_at: new Date(),
        updated_at: new Date(),
      });

      for (const item of bookingData.items) {
        const ticket = await queryRunner.manager.findOne(Tickets, {
          where: { id: item.ticket_id },
          relations: ['show']
        });
  
        if (!ticket) {
          throw new Error(`Ticket with ID ${item.ticket_id} not found`);
        }
  
        const totalPrice = item.unit_price * item.quantity;
        const finalPrice = totalPrice - (item.discount_amount || 0);
  
        await queryRunner.manager.save(OrderItems, {
          order_id: order.id,
          ticket_id: item.ticket_id,
          show_id: ticket.show_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: totalPrice,
          discount_amount: item.discount_amount || 0,
          final_price: finalPrice,
          special_requests: item.special_requests || null,
          seat_id: item.seat_id || null,
          created_at: new Date(),
          updated_at: new Date(),
        });
  
        this.logger.log(`✅ Order item created for ticket ${item.ticket_id}, quantity: ${item.quantity}`);
      }

      await queryRunner.manager.save(Payments, {
        user_id: bookingData.userId,
        order_id: order.id,
        amount: bookingData.finalAmount,
        currency: bookingData.paymentInfo?.currency ?? 'VND',
        provider: bookingData.paymentInfo?.provider ?? 'UNKNOWN',
        method: (bookingData.paymentInfo?.method as PAYMENT_METHOD) ?? PAYMENT_METHOD.CARD,
        status: PAYMENT_STATUS.PENDING,
        transaction_id: bookingData.paymentInfo?.transactionId ?? '',
        failure_msg: '',
        created_at: new Date(),
        updated_at: new Date(),
      });
      await queryRunner.commitTransaction();
      this.logger.log(`🎉 Order ${order.id} created with PENDING status`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`❌ Error processing orderNumber ${bookingData.orderNumber}:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBookingStatus(bookingId: string): Promise<any> {
    const booking = await this.redisService.get(`booking:${bookingId}`);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async getBookingTTL(orderNumber: string): Promise<{
    orderNumber: string;
    status: string;
    expiresAt: string;
    remainingSeconds: number;
    remainingMinutes: number;
    isExpired: boolean;
  }> {
    try {
      // Lấy thông tin booking từ Redis
      const bookingData = await this.redisService.get(`order:${orderNumber}`) as any;
      
      if (!bookingData) {
        throw new NotFoundException('Booking not found or has expired');
      }

      const ttl = await this.redisService.getTTL(`order:${orderNumber}`);
      
      if (ttl <= 0) {
        throw new BadRequestException('Booking has expired');
      }

      return {
        orderNumber,
        status: bookingData.status,
        expiresAt: bookingData.expiresAt,
        remainingSeconds: ttl,
        remainingMinutes: Math.ceil(ttl / 60),
        isExpired: false
      };
    } catch (error) {
      this.logger.error(`Error getting booking TTL for order ${orderNumber}:`, error);
      throw error;
    }
  }

  async checkBookingStatus(orderNumber: string) {
    try {
      const bookingData = await this.redisService.get(`order:${orderNumber}`) as any;
      
      if (!bookingData) {
        return {
          orderNumber,
          status: 'EXPIRED',
          isExpired: true,
          remainingSeconds: 0,
          remainingMinutes: 0
        };
      }

      const ttl = await this.redisService.getTTL(`order:${orderNumber}`);
      
      return {
        orderNumber,
        status: bookingData.status,
        expiresAt: bookingData.expiresAt,
        remainingSeconds: Math.max(0, ttl),
        remainingMinutes: Math.max(0, Math.ceil(ttl / 60)),
        isExpired: ttl <= 0
      };
    } catch (error) {
      this.logger.error(`Error checking booking status for order ${orderNumber}:`, error);
      return {
        orderNumber,
        status: 'ERROR',
        isExpired: true,
        remainingSeconds: 0,
        remainingMinutes: 0
      };
    }
  }
}