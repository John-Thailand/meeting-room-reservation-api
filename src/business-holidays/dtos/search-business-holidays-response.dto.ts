import { Expose, Type } from "class-transformer";
import { BusinessHolidayDto } from "./business-holiday.dto";

export class SearchBusinessHolidaysResponseDto {
  @Expose()
  // BusinessHolidayからBusinessHolidayDtoへ変換する
  @Type(() => BusinessHolidayDto)
  business_holidays: BusinessHolidayDto[];

  @Expose()
  total: number;
}
