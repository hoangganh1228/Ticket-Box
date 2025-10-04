import { IsEnum, IsOptional } from "class-validator";

const validStatuses = ['all', 'success', 'processing', 'cancelled'];
const validTimes = ['upcoming', 'past'];
export class OrderByUserDto {
    @IsEnum(validStatuses, { message: 'status must be one of the following values: all, success, processing, cancelled' })
    status: string;
    @IsOptional()
    @IsEnum(validTimes, { message: 'time must be one of the following values: upcoming, past' })
    time?: string;
}