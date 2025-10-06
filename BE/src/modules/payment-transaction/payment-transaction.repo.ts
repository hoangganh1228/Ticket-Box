import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { PaymentTransactions } from 'src/database/entities/PaymentTransaction';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PaymentTransactionRepo extends BaseRepository<PaymentTransactions> {
  constructor(
    @InjectRepository(PaymentTransactions)
    private readonly paymentTransactionRepo: Repository<PaymentTransactions>,
  ) {
    super(paymentTransactionRepo);
  }

  async updateStatus(  orderCode : string, status : string, manager ?: EntityManager) : Promise<any> { 

    const repo = manager ? manager.getRepository(PaymentTransactions) : this.paymentTransactionRepo;

    return await repo.update({ order_code : orderCode }, {
        status : status as any,
    })
  }
}
