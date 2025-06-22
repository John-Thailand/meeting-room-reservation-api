import { Expose } from "class-transformer";

export class CoworkingSpaceDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  open_time: string;

  @Expose()
  close_time: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
