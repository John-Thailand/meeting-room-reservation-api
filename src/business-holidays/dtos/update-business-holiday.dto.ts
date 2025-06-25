import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateBusinessHolidayDto {
  @IsString()
  @IsOptional()
  coworking_space_id: string;

  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  business_holiday: Date;
}
