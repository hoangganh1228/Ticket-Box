import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/database/entities/Orders';
import { PaymentsRepository } from './payments.repository';
import { Payments } from 'src/database/entities/Payments';
import { MockBankService } from './mock-bank.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../events/events.module';
import { PaymentsGatewayModule } from '../payments-gateway/payments-gateway.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, Payments]), 
    NotificationsModule, 
    forwardRef(() => PaymentsGatewayModule),
    EventsModule
  ],
  providers: [OrdersRepository, PaymentsRepository, OrdersService, MockBankService],
  controllers: [OrdersController],
  exports: [OrdersService, MockBankService]
})
export class OrdersModule {}
