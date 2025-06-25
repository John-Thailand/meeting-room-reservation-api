import { Expose } from "class-transformer";

export class BusinessHolidayDto {
  @Expose()
  id: string;

  @Expose()
  coworking_space_id: string;

  @Expose()
  business_holiday: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
