import { IsArray } from "class-validator";

export class CreateOrUpdatePermissionInRoleEventDTO {
    @IsArray()
    permissionIds: number[];
}