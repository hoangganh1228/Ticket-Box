import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodRepo } from './payment-method.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/database/entities/PaymentMethod';

@Module({
  imports : [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService,PaymentMethodRepo],
  exports : [PaymentMethodService,PaymentMethodRepo]
})
export class PaymentMethodModule {}
