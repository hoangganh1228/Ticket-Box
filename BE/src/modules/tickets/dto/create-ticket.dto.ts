import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, IsUrl, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  total_ticket: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  min_ticket?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  max_ticket?: number;

  @IsNumber()
  show_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  @IsUrl()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  is_free?: boolean;
}
