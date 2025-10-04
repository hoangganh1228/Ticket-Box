import {
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ticketsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ticketsService.delete(+id);
  }
}
