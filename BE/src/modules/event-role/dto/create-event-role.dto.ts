import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateEventRoleDto {
  @IsNotEmpty()
  display_name: string;
  @Optional()
  code?: string;
}
