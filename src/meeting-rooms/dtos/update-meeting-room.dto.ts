import { IsOptional, IsString, Length } from "class-validator";

export class UpdateMeetingRoomDto {
  @IsString()
  @IsOptional()
  coworking_space_id: string;

  @IsString()
  @Length(1, 28)
  @IsOptional()
  name: string;
}
