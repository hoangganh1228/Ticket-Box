import { IsEnum } from "class-validator";

export class getMyEventDto {
    @IsEnum(['draft', 'pending', 'upcoming', 'past'], { message: 'Type must be one of the following values: draft, pending, upcoming, past' })
    type: string;
}