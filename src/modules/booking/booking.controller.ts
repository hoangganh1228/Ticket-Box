import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('events/:eventId')
// @UseGuards(JwtAccessGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get('booking/:showId')
  async getBooking(@Param('showId', ParseIntPipe) showId: number) {
    return this.bookingService.getInfoShow(showId);
  }

  @Post('booking')
  @UseGuards(JwtAccessGuard)
  async createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    const userId = req.user?.sub ?? dto.userId ?? 1; 
    const userEmail = req.user?.email ?? dto.email ?? "test@example.com";
    return this.bookingService.createBooking(userId, dto, userEmail);
  }

  @Get('booking/:orderNumber/ttl')
  async getBookingTTL(@Param('orderNumber') orderNumber: string) {
    return this.bookingService.getBookingTTL(orderNumber);
  }

  @Get('booking/:orderNumber/status')
  async checkBookingStatus(@Param('orderNumber') orderNumber: string) {
    return this.bookingService.checkBookingStatus(orderNumber);
  }

}