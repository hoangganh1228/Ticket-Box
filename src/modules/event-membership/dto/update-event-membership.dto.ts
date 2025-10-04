import { IsNotEmpty } from "class-validator";

export class UpdateEventMembershipDto {
    @IsNotEmpty()
    user_id: number;
    @IsNotEmpty()
    event_role_id: number;
}
