import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketsRepository } from './tickets.repository';
import { Tickets } from 'src/database/entities/Tickets';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets])],
  controllers: [TicketsController],
  providers: [TicketsRepository, TicketsService],
  exports: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
