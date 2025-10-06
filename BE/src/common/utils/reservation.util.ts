import { BadRequestException, ConflictException } from '@nestjs/common';

export const handleReservationError = (reservationResult: any): never => {
  switch (reservationResult.status) {
    case 'ALREADY_RESERVED':
      throw new ConflictException(reservationResult.message);
    case 'OUT_OF_STOCK':
      throw new BadRequestException(reservationResult.message);
    case 'LOCKED':
      throw new ConflictException(reservationResult.message);
    default:
      throw new BadRequestException(reservationResult.message);
  }
};