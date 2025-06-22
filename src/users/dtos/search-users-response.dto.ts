import { Expose, Type } from "class-transformer";
import { UserDto } from "./user.dto";

export class SearchUsersResponseDto {
  @Expose()
  // UserからUserDtoへ変換する
  @Type(() => UserDto)
  users: UserDto[];

  @Expose()
  total: number;
}
