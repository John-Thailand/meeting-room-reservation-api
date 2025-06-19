import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // 文字列 "2025-06-12" をDate型に変換
  @Type(() => Date)
  @IsDate()
  contract_start_date: Date;
}
