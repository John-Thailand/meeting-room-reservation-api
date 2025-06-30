import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SearchReservationsRequestDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  meeting_room_id: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;
}
