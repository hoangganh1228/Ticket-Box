import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentsGatewayService } from './payments-gateway.service';
import { vnpConfig } from 'src/config/vnpay.config';

@Controller('payments-gateway')
export class PaymentsGatewayController {
	constructor(private readonly paymentsGatewayService: PaymentsGatewayService) { }

	@Post('momo/create')
	async createMomo(@Body() body: any, @Req() req: any) {
		const ip =
			(req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
			req.ip ||
			undefined;

		return this.paymentsGatewayService.createMomo({
			...body, // { orderNumber, amount, description?, userId }
			ipAddress: ip,
		});
	}

	@Get('momo/return')
	async momoReturn(@Query() query: any, @Res() res: any) {
		const { eventId, showId, orderCode, resultCode } = query;

		const isSuccess = Number(resultCode) === 0;

		if (isSuccess) {
			return res.redirect(302, `${vnpConfig.frontend_Success_Url}/events/${eventId}/bookings/${showId}/${orderCode}?status=success`);
		} else {
			return res.redirect(302, `${vnpConfig.frontend_Success_Url}/events/${eventId}/bookings/${showId}/${orderCode}?status=fail`);
		}

	}

	@Post('momo/webhook')
	async momoWebhook(@Body() body: any) {
		return this.paymentsGatewayService.momoWebhook(body);
	}
}