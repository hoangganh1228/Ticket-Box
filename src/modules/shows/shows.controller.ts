import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowWithTicketsDto } from './dto/create-show.dto';

@Controller('events')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Put(':eventId/showings')
  create(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createShowDto: CreateShowWithTicketsDto[],
  ) {
    return this.showsService.create(eventId, createShowDto);
  }

  @Get(':eventId/showings')
    findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.showsService.findAllByEvent(eventId);
  }

  @Get(':eventId/showings/:showId')
  findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('showId', ParseIntPipe) showId: number,
  ) {
    return this.showsService.findOne(eventId, showId);
  }


  @Delete(':eventId/showings/:id')
  remove(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.showsService.delete(eventId, id);
  }

  @Get('/showings/:showId')
  getTicketsByShow(
    @Param('showId', ParseIntPipe) showId: number,
  ) {
    return this.showsService.getTicketsByShow(showId);
  }
}
