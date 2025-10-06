import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';
import { Shows } from 'src/database/entities/Shows';
import { TicketsModule } from '../tickets/tickets.module';
import { ShowsRepository } from './shows.repository';
import { EventsModule } from '../events/events.module';
import { EventsRepository } from '../events/repositories/events.repository';
import { RedisModule } from 'src/common/redis/redis.module';
import { TicketsRepository } from '../tickets/tickets.repository';
import { Tickets } from 'src/database/entities/Tickets';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shows, Tickets]), 
    TicketsModule, 
    EventsModule,
    TicketsModule,
    RedisModule, // Thêm RedisModule
  ],
  controllers: [ShowsController],
  providers: [ShowsService, ShowsRepository, TicketsRepository],
  exports: [ShowsService, ShowsRepository]
})
export class ShowsModule {}
