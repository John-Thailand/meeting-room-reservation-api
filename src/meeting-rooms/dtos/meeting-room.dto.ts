import { Expose } from "class-transformer";

export class MeetingRoomDto {
  @Expose()
  id: string;

  @Expose()
  coworking_space_id: string;

  @Expose()
  name: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
