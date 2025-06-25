import { Expose, Type } from "class-transformer";
import { BusinessHolidayDto } from "./business-holiday.dto";

export class SearchBusinessHollidaysResponseDto {
  @Expose()
  // BusinessHolidayからBusinessHolidayDtoへ変換する
  @Type(() => BusinessHolidayDto)
  business_holidays: BusinessHolidayDto[];

  @Expose()
  total: number;
}
