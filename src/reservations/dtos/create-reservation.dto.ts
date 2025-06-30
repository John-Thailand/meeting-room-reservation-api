import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IsQuartersHourDate } from "../validators/is_quarters_hour_date.validator";

export class CreateReservationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
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
