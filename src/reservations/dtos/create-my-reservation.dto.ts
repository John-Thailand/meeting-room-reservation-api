import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";
import { IsQuartersHourDate } from "../validators/is_quarters_hour_date.validator";

export class CreateMyReservationDto {
  @IsString()
  meeting_room_id: string;

  @Type(() => Date)
  @IsDate()
  @IsQuartersHourDate()
  start_datetime: Date;

  @Type(() => Date)
  @IsDate()
  @IsQuartersHourDate()
  end_datetime: Date;
}
