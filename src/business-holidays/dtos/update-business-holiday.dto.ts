import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID, MinDate } from "class-validator";

export class UpdateBusinessHolidayDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  coworking_space_id: string;

  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(), {
    message: 'business holiday from the current date onwards'
  })
  @IsOptional()
  business_holiday: Date;
}
