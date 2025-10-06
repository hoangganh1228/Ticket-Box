// src/events/dto/get-recomment-events.dto.ts
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecommentEventsDto {
  @IsOptional()
  @IsString()
  at?: string; // ví dụ: "this-month", "this-week"

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  category?: string; // ví dụ: "music", "others"
}
