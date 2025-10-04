import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/database/entities/Orders';
import { OrderItems } from 'src/database/entities/OrderItems';
import { Tickets } from 'src/database/entities/Tickets';
import { Shows } from 'src/database/entities/Shows';
import { RedisModule } from 'src/common/redis/redis.module';
import { RabbitmqModule } from 'src/common/rabbitmq/rabbitmq.module';
import { BookingController } from './booking.controller';
import { Payments } from 'src/database/entities/Payments';
// import { PaymentProcessor } from './payment.processor';
import { ShowsRepository } from '../shows/shows.repository';
import { ShowsModule } from '../shows/shows.module';
import { BookingProcessor } from './booking.processor';
import { NotificationsModule } from '../notifications/notifications.module';
import { TicketsRepository } from '../tickets/tickets.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, OrderItems, Tickets, Shows, Payments]),
    RedisModule,
    RabbitmqModule,
    ShowsModule,
    NotificationsModule,
  ],
  providers: [ShowsRepository, TicketsRepository, BookingService, BookingProcessor],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
