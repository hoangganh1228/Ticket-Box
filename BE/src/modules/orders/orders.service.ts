import { Injectable, NotFoundException, Logger, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { ProcessPaymentDto } from './dto/payment.dto';
import { PaymentsRepository } from './payments.repository';
import { PAYMENT_METHOD } from 'src/common/enums/payment.enum';
import { RedisService } from 'src/common/redis/redis.service';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';
import { ORDER_STATUS } from 'src/common/enums/order_status.enum';
import { OrderByUserDto } from './dto/orderByUser.dto';
import { EventRepository } from '../events/events.repo';
import { DataSource } from 'typeorm';
import { Orders } from 'src/database/entities/Orders';
import { Payments } from 'src/database/entities/Payments';
import { Tickets } from 'src/database/entities/Tickets';
import { PaymentsGatewayService } from '../payments-gateway/payments-gateway.service';
import { TTL } from 'src/common/enums/ttl.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { responseCustomize } from 'src/common/utils/responseCustomize';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly redisService: RedisService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => PaymentsGatewayService))
    private readonly paymentsGatewayService: PaymentsGatewayService
  ) { }

  async getOrder(orderNumber: string) {
    const order = await this.ordersRepository.findByOrderNumberWithEvent(orderNumber);
    if (!order) throw new NotFoundException('Order was not found');
    return order;
  }

  async getOrderFromCache(orderNumber: string) {
    const order = await this.redisService.get<any>(`order:${orderNumber}`);
    if (!order) throw new NotFoundException('Order not found in cache');
    return order;
  }

  async createPayment(orderNumber: string, userId: number, paymentDto: ProcessPaymentDto) {
    const { currency, method, provider, EventId, ShowId } = paymentDto;

    const cacheKey = `order:${orderNumber}`;
    const order = await this.redisService.get<any>(cacheKey);
    if (!order) throw new NotFoundException('Order not found in cache');

    // if (order.status !== 'RESERVED') {
    //   throw new BadRequestException(`Invalid booking status: ${order.status}`);
    // }

    const pendingPayload = {
      ...order,
      status: ORDER_STATUS.PENDING,
      paymentInfo: {
        amount: order.finalAmount,
        currency: currency,
        provider: provider,
        method: method as PAYMENT_METHOD,
        status: 'pending',
      },
    };


    await this.rabbitmqService.publishBookingRequest({
      bookingId: pendingPayload.bookingId,
      userId: pendingPayload.userId,
      eventId: pendingPayload.eventId,
      dto: pendingPayload,
      retryCount: 0,
    });

    await this.redisService.set(cacheKey, {
      ...pendingPayload,
      expiresAt: new Date(Date.now() + TTL.ORDER * 1000).toISOString(),
    }, TTL.ORDER);


    if ((paymentDto.provider || '').toLowerCase() === 'momo') {
      const createRes = await this.paymentsGatewayService.createMomo({
        orderNumber: order.order_number || orderNumber,
        amount: order.final_amount || order.finalAmount,
        description: `Thanh toán đơn ${orderNumber}`,
        userId,
        EventId,
        ShowId,
      });

      console.log("createRes", createRes);

      if (!createRes.payUrl) {
        this.logger.warn(`MoMo createPayment failed for ${orderNumber}`, createRes?.raw);
        throw new BadRequestException('Không tạo được giao dịch MoMo');
      }

      return {
        provider: 'momo',
        redirectUrl: createRes.payUrl,
        deeplink: createRes.deeplink,
        orderNumber,
      };

    }
  }

  private async waitForOrderCreated(orderNumber: string, timeoutMs: number): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const order = await this.ordersRepository.findByOrderNumber(orderNumber);
      if (order) {
        this.logger.log(`✅ Order ${orderNumber} created successfully`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    throw new Error(`Order ${orderNumber} not created within ${timeoutMs}ms`);
  }


  async processPaymentDirectly(payload: any, items: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const order = await queryRunner.manager.findOne(Orders, {
        where: { order_number: payload.orderNumber }
      });
      if (!order) {
        throw new Error(`Order ${payload.orderNumber} not found in database`);
      }

      await queryRunner.manager.update(Orders,
        { id: order.id },
        {
          status: payload.status,
          updated_at: new Date()
        }
      );

      const payment = await queryRunner.manager.findOne(Payments, {
        where: { order_id: order.id }
      });

      if (payment) {
        await queryRunner.manager.update(Payments,
          { id: payment.id },
          {
            status: payload.paymentInfo.status,
            transaction_id: payload.paymentInfo.transactionId,
            failure_msg: payload.paymentInfo.failureReason,
            updated_at: new Date(),
          }
        );
      }
      // 4. Xử lý theo kết quả thanh toán
      if (payload.status === ORDER_STATUS.PAID) {
        if (order.email) {
          await this.rabbitmqService.publishEmailNotification({
            to: order.email,
            subject: `Thanh toán thành công đơn ${order.order_number}`,
            template: 'order-paid',
            data: {
              orderNumber: order.order_number,
              bookingId: order.id,
              amount: order.final_amount,
              currency: payload.paymentInfo.currency,
              method: payload.paymentInfo.method,
              status: payload.paymentInfo.status,
              paidAt: new Date(),
            },
          });
        }
        await this.handleSuccessfulPayment(queryRunner, order.id, payload.userId, items);
        await this.redisService.del(`order:${payload.orderNumber}`);
      } else {

        await this.handleFailedPayment(payload.userId, items, payload.orderNumber);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`✅ Payment result processed for order ${payload.orderNumber}`);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`❌ Error processing payment result:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async handleSuccessfulPayment(queryRunner: any, orderId: number, userId: number, items: any[]): Promise<void> {
    for (const item of items) {
      const res = await queryRunner.manager
        .createQueryBuilder()
        .update(Tickets)
        .set({ total_ticket: () => `total_ticket - ${item.quantity}` })
        .where('id = :id AND total_ticket >= :qty', {
          id: item.ticket_id,
          qty: item.quantity
        })
        .execute();

      if (res.affected === 0) {
        throw new Error(`Not enough ticket quantity for t
          icket ${item.ticket_id}`);
      }
      await this.redisService.confirmReservation(
        item.ticket_id,
        userId,
        item.quantity
      );
    }

    this.logger.log(`✅ Tickets confirmed and inventory updated for order ${orderId}`);
  }

  private async handleFailedPayment(userId: number, items: any[], orderNumber: string): Promise<void> {
    // Release reserved tickets về Redis
    for (const item of items) {
      try {
        await this.redisService.releaseReservedTickets(
          item.ticket_id,
          userId,
          item.quantity
        );
        await this.redisService.cleanupReservationHolds(item.ticket_id, userId);
        this.logger.log(`�� Released ${item.quantity} tickets for user ${userId}, ticket ${item.ticket_id}`);
      } catch (error) {
        this.logger.error(`❌ Error releasing tickets:`, error);
      }
    }
    await this.redisService.del(`order:${orderNumber}`);

    this.logger.log(`🔄 All reserved tickets released for failed payment`);
  }

  async cancelOrder(orderNumber: string) {
    const cacheKey = `order:${orderNumber}`;
    const cached = await this.redisService.get<any>(cacheKey);
    await this.redisService.del(cacheKey);

    if (cached?.items?.length && cached?.userId) {
      const userId = cached.userId as number;

      for (const item of cached.items) {
        await this.redisService.releaseReservedTickets(
          item.ticket_id,
          userId,
          item.quantity
        );
        await this.redisService.cleanupReservationHolds(item.ticket_id, userId);
      }
    }
  }

  async getPaymentStatus(orderNumber: string) {
    const order = await this.ordersRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Get latest payment for this order
    const payments = await this.paymentsRepository.findByOrderId(order.id);

    return {
      orderNumber: order.order_number,
      orderStatus: order.status,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        method: payment.method,
        status: payment.status,
        transactionId: payment.transaction_id,
        failureMsg: payment.failure_msg,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at
      }))
    };
  }

  async getUserOrdersAndTicket(userId: number, query: OrderByUserDto, pagination: PaginationQueryDto) {
    const { status, time } = query;
    const { page, limit, order = 'ASC', sortBy = 'id', search } = pagination;
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    const statusMapping: Record<string, string[]> = {
      success: ['paid', 'confirmed'],
      processing: ['pending'],
      cancelled: ['cancelled', 'expired', 'refunded', 'failed'],
    };

    const statusOrder: string | string[] = status === 'all' ? '' : statusMapping[status] || [];


    const date = new Date().toISOString();
    const compareTime = time === 'upcoming' ? '>' : time ? '<' : '';

    const { data, total } = await this.ordersRepository.getMyTickets(userId, statusOrder, compareTime, date, pageNumber, limitNumber);
    return responseCustomize(data, total, pageNumber, limitNumber);
  }
  async getOrderStatus(status: string, timeline: string, user: any) {
    return this.ordersRepository.getOrderStatus(status, timeline, user);
  }
  async getElectronicTicket(orderNumber: string) {
    const order = await this.ordersRepository.getElectronicTicket(orderNumber);
    if (!order) throw new NotFoundException('Order was not found');
    return order;
  }
}
