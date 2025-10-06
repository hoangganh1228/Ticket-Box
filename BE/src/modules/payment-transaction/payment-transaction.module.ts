import { Module } from '@nestjs/common';
import { PaymentTransactionService } from './payment-transaction.service';
import { PaymentTransactionController } from './payment-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransactions } from 'src/database/entities/PaymentTransaction';
import { PaymentTransactionRepo } from './payment-transaction.repo';

@Module({
  imports : [TypeOrmModule.forFeature([PaymentTransactions])],
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService,PaymentTransactionRepo],
  exports : [PaymentTransactionService,PaymentTransactionRepo],
})
export class PaymentTransactionModule {}
