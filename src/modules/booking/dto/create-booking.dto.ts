import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsOptional, IsPositive, IsString, Length, Min, ValidateNested } from "class-validator";

export class BookingItemDto {
  @IsNumber()
  @IsPositive()
  ticket_id: number;  

  @IsNumber()
  @IsPositive()
  show_id: number;    

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  selected_seat_ids?: number[];

  @IsNumber()
  unit_price: number;  
  

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  special_requests?: string; 
}

export class CreateBookingDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  userId?: number;

  @IsNumber()
  @IsPositive()
  event_id: number;        

  @IsNumber()
  @Min(0)
  discount_amount: number; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  note?: string;
}