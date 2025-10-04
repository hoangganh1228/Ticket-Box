import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionEventDto {
  @IsNotEmpty()
  display_name: string;
  @IsOptional()
  code?: string;
}
