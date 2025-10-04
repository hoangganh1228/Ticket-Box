import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class SocketEventsService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  // emitRemainingTicketsUpdated( payload : { eventId : number, showId : number, tickets : CartItems[] } ) {
  //   this.eventsGateway.server.emit('remaining_ticket_update', payload);
  // }

  // emitRemainingTicketsDelete( payload : { eventId : number, showId : number, tickets : CartItems[] } ) {
  //   this.eventsGateway.server.emit('remaining_ticket_delete', payload);
  // }
}
