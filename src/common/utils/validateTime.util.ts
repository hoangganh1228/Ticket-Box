// src/common/utils/time.util.ts
import { BadRequestException } from '@nestjs/common';

export function validateShowTimes(startTime: string, endTime: string) {
  if (endTime && new Date(startTime) >= new Date(endTime)) {
    throw new BadRequestException(`Show start_time must be earlier than end_time`);
  }
}

export function validateTicketTimes(
  showStart: string,
  showEnd: string,
  ticketStart: string,
  ticketEnd: string
) {
  // if (ticketStart && new Date(ticketStart) < new Date(showStart)) {
  //   throw new BadRequestException(`Ticket start_time cannot be before Show start_time`);
  // }

  if (ticketEnd && showEnd && new Date(ticketEnd) > new Date(showEnd)) {
    throw new BadRequestException(`Ticket end_time cannot be after Show end_time`);
  }

  if (ticketStart && ticketEnd && new Date(ticketStart) >= new Date(ticketEnd)) {
    throw new BadRequestException(`Ticket start_time must be earlier than ticket end_time`);
  }
}

export function validateTicketQuantities(
  minTicket: number | undefined,
  maxTicket: number | undefined,
  totalTicket: number
) {
  // total_ticket đã được @Min(1) ở DTO, nhưng vẫn phòng vệ
  if (typeof totalTicket !== 'number' || totalTicket < 1) {
    throw new BadRequestException(`total_ticket must be a positive number`);
  }

  if (typeof minTicket === 'number' && typeof maxTicket === 'number') {
    if (minTicket > maxTicket) {
      throw new BadRequestException(`min_ticket must be less than or equal to max_ticket`);
    }
  }

  if (typeof minTicket === 'number') {
    if (minTicket > totalTicket) {
      throw new BadRequestException(`min_ticket must be less than or equal to total_ticket`);
    }
  }

  if (typeof maxTicket === 'number') {
    if (maxTicket > totalTicket) {
      throw new BadRequestException(`max_ticket must be less than or equal to total_ticket`);
    }
  }
}