import { Type } from "class-transformer";
import { IsDate, MinDate } from "class-validator";

export class CreateBusinessHolidayDto {
  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(), {
    message: 'business holiday from the current date onwards'
  })
  business_holiday: Date;
}
