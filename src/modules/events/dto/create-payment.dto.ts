import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BUSINESS_TYPE } from 'src/common/enums/paymentEvent.enum';

export class CreatePaymentEventDto {
  @IsString()
  @MaxLength(255)
  account_name: string;

  @IsString()
  @MaxLength(255)
  account_number: string;

  @IsString()
  @MaxLength(255)
  bank_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  local_branch?: string;

  @IsEnum(BUSINESS_TYPE)
  business_type: BUSINESS_TYPE;
}