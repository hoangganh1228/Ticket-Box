import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ProcessPaymentDto } from './dto/payment.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { OrderByUserDto } from './dto/orderByUser.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }
  @Get('user-orders')
  @UseGuards(JwtAccessGuard)
  getUserOrdersAndTicket(@Req() req: any,
    @Query() query: OrderByUserDto,
    @Query() pagination: PaginationQueryDto
  ) {
    const userId = req.user.sub;
    return this.ordersService.getUserOrdersAndTicket(userId, query, pagination);
  }
  
  @Get(':orderNumber')
  getOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.getOrder(orderNumber);
  }
  @Get(':orderNumber/electronic-ticket')
  getElectronicTicket(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.getElectronicTicket(orderNumber);
  }

  @Get(':orderNumber/cache')
  getOrderFromCache(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.getOrderFromCache(orderNumber);
  }

  @Post(':orderNumber/payment')
  @UseGuards(JwtAccessGuard)
  createPayment(@Param('orderNumber') orderNumber: string, @Req() req: any, @Body() paymentDto: ProcessPaymentDto) {
    const userId = req.user.sub;
    return this.ordersService.createPayment(orderNumber, userId, paymentDto);
  }

  @Patch(':orderNumber/cancel')
  cancelOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.cancelOrder(orderNumber);
  }
  @Get()
  async getOrderStatus(
    @Query('status') status: string,
    @Query('timeline') timeline: string,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.ordersService.getOrderStatus(status, timeline, user);
  }
}
