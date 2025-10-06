import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventMembershipDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  event_role_id: number;
  @IsOptional()
  joined_at: Date;
}
