import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from 'src/database/entities/Payments';
import { ProcessPaymentDto } from './dto/payment.dto';
import { PAYMENT_METHOD } from 'src/common/enums/payment.enum';
import { Orders } from 'src/database/entities/Orders';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payments) 
    private readonly repo: Repository<Payments>
  ) {}

  async createPayment(order: Orders, userId: number, paymentDto: ProcessPaymentDto) {
    const payment = this.repo.create({
      order_id: order.id,
      user_id: userId,
      amount: order.final_amount,
      currency: paymentDto.currency,
      provider: paymentDto.provider,
      method: paymentDto.method as PAYMENT_METHOD,
    });
    
    return this.repo.save(payment);
  }

  async savePayment(payment: Payments) {
    return this.repo.save(payment);
  }

  async findByOrderId(orderId: number) {
    return this.repo.find({
      where: { order_id: orderId },
      order: { created_at: 'DESC' }
    });
  }

  async findByTransactionId(transactionId: string) {
    return this.repo.findOne({
      where: { transaction_id: transactionId }
    });
  }
}
