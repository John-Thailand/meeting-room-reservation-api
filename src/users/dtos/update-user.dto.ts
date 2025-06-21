import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/, {
    message: 'your password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  })
  @IsOptional()
  password: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  contract_start_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  withdrawal_date: Date;
}
