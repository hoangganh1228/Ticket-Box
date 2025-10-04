import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ORDER_STATUS } from 'src/common/enums/order_status.enum';
import { MomoProvider } from './providers/momo.provider';
import { CreatePaymentInput } from './providers/payment-provider.interface';
import { RedisService } from 'src/common/redis/redis.service';
import { DataSource } from 'typeorm';
import { Orders } from 'src/database/entities/Orders';
import { OrderItems } from 'src/database/entities/OrderItems';

@Injectable()
export class PaymentsGatewayService {
  constructor(
    private readonly momo: MomoProvider,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  async createMomo(input: CreatePaymentInput) {
    return this.momo.createPayment(input);
  }

  async momoReturn(query: any) {
    return this.momo.verifyReturn(query);
  }

  async momoWebhook(body: any) {
    const v = await this.momo.verifyWebhook(body);
    console.log("v", v);
    if (!v.isValid || !v.orderNumber) return { success: false };

    let cache: any = null;
    try {
      cache = await this.redisService.get(`order:${v.orderNumber}`);
    } catch {}
    
    let userId = cache?.userId ?? 0;
    let items =
      Array.isArray(cache?.items)
        ? cache.items.map((i: any) => ({
            ticket_id: i.ticket_id,
            quantity: i.quantity,
          }))
        : [];

    if ((!items || items.length === 0) || !userId) {
      const order = await this.dataSource.getRepository(Orders).findOne({
        where: { order_number: v.orderNumber },
      });
      if (order) {
        userId = userId || order.user_id;
        const dbItems = await this.dataSource.getRepository(OrderItems).find({
          where: { order_id: order.id },
          select: ['ticket_id', 'quantity'],
        });
        if (dbItems?.length) {
          items = dbItems.map(i => ({ ticket_id: i.ticket_id, quantity: i.quantity }));
        }
      }
    }

    const payload = {
      orderNumber: v.orderNumber,
      userId: userId || 0,
      status: v.status === 'SUCCESS' ? ORDER_STATUS.PAID : ORDER_STATUS.FAILED,
      paymentInfo: {
        amount: v.amount,
        currency: 'VND',
        provider: 'momo',
        method: 'WALLET',
        status: v.status === 'SUCCESS' ? 'success' : 'failed',
        transactionId: v.providerTransactionId || '',
      },
      items, 
    };

    await this.ordersService.processPaymentDirectly(payload, payload.items);
    return { success: true };
  }
}