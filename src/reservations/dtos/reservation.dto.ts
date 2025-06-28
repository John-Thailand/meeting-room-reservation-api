import { Expose } from "class-transformer";

export class ReservationDto {
  @Expose()
  id: string;

  @Expose()
  meeting_room_id: string;

  @Expose()
  user_id: string;

  @Expose()
  start_datetime: Date;

  @Expose()
  end_datetime: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
