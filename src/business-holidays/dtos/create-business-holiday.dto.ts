import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class CreateBusinessHolidayDto {
  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  business_holiday: Date;
}
