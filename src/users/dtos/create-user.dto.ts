import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/, {
    message: 'your password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  })
  password: string;

  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  contract_start_date: Date;
}
