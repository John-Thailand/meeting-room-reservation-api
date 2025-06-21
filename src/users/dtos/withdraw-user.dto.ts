import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class WithdrawUserDto {
  @Type(() => Date)
  @IsDate()
  withdrawal_date: Date
}
