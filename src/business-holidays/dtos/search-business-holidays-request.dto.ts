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
  @IsIn(['business_holiday', 'created_at', 'updated_at'])
  @IsOptional()
  order_by: 'business_holiday' | 'created_at' | 'updated_at' = 'business_holiday';

  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'asc';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page_size: number = 50;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number = 0;
}
