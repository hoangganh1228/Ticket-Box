import { IsOptional, IsString } from 'class-validator';
export class PaginationQueryDto {
  @IsOptional()
  page?: string = '1';

  @IsOptional()
  limit?: string = '10';

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  search?: string = '';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'ASC';
}
