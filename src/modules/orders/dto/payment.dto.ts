import { IsString, IsIn, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PAYMENT_METHOD } from 'src/common/enums/payment.enum';

export class ProcessPaymentDto {
  @IsString()
  @IsIn(['vnpay', 'vietqr', 'shopeepay', 'zalopay', 'card', 'momo'])
  provider: string;

  @IsString()
  // @IsEnum(PAYMENT_METHOD)
  method: string;

  @IsString()
  currency: string;

  @IsNumber()
  @IsOptional()
  ShowId?: number;
  @IsNumber()
  @IsOptional()
  EventId?: number;
  @IsOptional()
  orderNumber?: number | string;
}
