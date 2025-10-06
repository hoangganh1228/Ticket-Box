// src/modules/payments-gateway/payments-gateway.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsGatewayService } from './payments-gateway.service';
import { MomoProvider } from './providers/momo.provider';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsGatewayController } from './payments-gateway.controller';

@Module({
  imports: [
    ConfigModule, 
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentsGatewayController],
  providers: [PaymentsGatewayService, MomoProvider],
  exports: [PaymentsGatewayService],
})
export class PaymentsGatewayModule {}