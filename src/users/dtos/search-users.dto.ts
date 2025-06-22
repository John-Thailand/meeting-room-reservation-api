import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class SearchUsersDto {
  @IsString()
  @IsOptional()
  email: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  registered_from_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  registered_to_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  withdrawal_from_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  withdrawal_to_date: Date;

  @IsBoolean()
  // 'true'や'1'などの値をリクエストから受け取るので、それをbooleanのtrueやfalseに変換する
  @Transform(({ value }) => value === 'true' || value === '1')
  @IsOptional()
  include_administrators: boolean = false;

  @IsString()
  // Checks if value is in an array of allowed values.
  @IsIn(['created_at', 'updated_at'])
  @IsOptional()
  order_by: 'created_at' | 'updated_at' = 'created_at';

  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page_size: number = 50;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number = 0;
}
