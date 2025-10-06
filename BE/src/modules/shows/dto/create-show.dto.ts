import { IsDateString, IsOptional, IsArray, ValidateNested, IsString, IsNumber, IsBoolean, Min, Max, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketTypeDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  max_ticket?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  min_ticket?: number;

  @IsNumber()
  @Min(1)
  total_ticket: number;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  thumbnail?: string;
}

export class CreateShowWithTicketsDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  ticketTypes: CreateTicketTypeDto[];
}
