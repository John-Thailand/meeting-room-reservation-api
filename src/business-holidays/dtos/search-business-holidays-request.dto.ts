import { Type } from "class-transformer";
import { IsDate, IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class SearchBusinessHolidaysRequestDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date: Date;

  @IsString()
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
