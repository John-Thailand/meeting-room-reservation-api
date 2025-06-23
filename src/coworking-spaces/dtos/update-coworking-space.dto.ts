import { IsOptional, IsString, Length, Matches } from "class-validator";

export class UpdateCoworkingSpaceDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  name: string;
  
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'open time must be in HH:mm format (e.g. 09:00)'
  })
  @IsOptional()
  open_time: string;
  
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'close time must be in HH:mm format (e.g. 21:00)'
  })
  @IsOptional()
  close_time: string;
}
