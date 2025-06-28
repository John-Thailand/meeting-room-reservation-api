import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class UpdateMeetingRoomDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  coworking_space_id: string;

  @IsString()
  @Length(1, 28)
  @IsOptional()
  name: string;
}
