import { IsString, Length } from "class-validator";

export class CreateMeetingRoomDto {
  @IsString()
  @Length(1, 28)
  name: string;
}
