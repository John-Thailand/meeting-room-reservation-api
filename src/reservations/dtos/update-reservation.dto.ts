import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsQuartersHourDate } from "../validators/is_quarters_hour_date.validator";

export class UpdateReservationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  meeting_room_id: string;

  @Type(() => Date)
  @IsDate()
  @IsQuartersHourDate()
  @IsOptional()
  start_datetime: Date;

  @Type(() => Date)
  @IsDate()
  @IsQuartersHourDate()
  @IsOptional()
  end_datetime: Date;
}
