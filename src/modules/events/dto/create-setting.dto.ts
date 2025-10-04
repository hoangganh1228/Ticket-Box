import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SETTING_TYPE } from 'src/common/enums/setting.enum';

export class CreateSettingDto {
  @IsEnum(SETTING_TYPE)
  type: SETTING_TYPE;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  message?: string;

  @IsString()
  @MaxLength(255)
  link: string;

  @IsString()
  @MaxLength(255)
  url: string
}