import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  display_name: string;
}
