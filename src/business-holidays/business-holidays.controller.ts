import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BusinessHolidaysService } from './business-holidays.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { BusinessHoliday } from './business-holiday.entity';
import { CreateBusinessHolidayDto } from './dtos/create-business-holiday.dto';
import { UpdateBusinessHolidayDto } from './dtos/update-business-holiday.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BusinessHolidayDto } from './dtos/business-holiday.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { SearchBusinessHolidaysRequestDto } from 'src/business-holidays/dtos/search-business-holidays-request.dto';
import { SearchBusinessHollidaysResponseDto } from './dtos/search-business-holidays-response.dto';

@Controller()
export class BusinessHolidaysController {
  constructor(
    private businessHolidaysService: BusinessHolidaysService
  ) {}

  @Get('coworking-spaces/:coworking_space_id/business-holidays')
  @UseGuards(AuthGuard)
  @Serialize(SearchBusinessHollidaysResponseDto)
  async searchBusinessHolidays(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Query() query: SearchBusinessHolidaysRequestDto
  ): Promise<SearchBusinessHollidaysResponseDto> {
    return this.businessHolidaysService.search(coworkingSpaceId, query)
  }

  @Post('coworking-spaces/:coworking_space_id/business-holidays')
  @UseGuards(AdminGuard)
  @Serialize(BusinessHolidayDto)
  async createBusinessHoliday(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Body() body: CreateBusinessHolidayDto,
  ): Promise<BusinessHoliday> {
    const businessHoliday = await this.businessHolidaysService.create(coworkingSpaceId, body.business_holiday)
    return businessHoliday
  }

  @Patch('business-holidays/:business_holiday_id')
  @UseGuards(AdminGuard)
  @Serialize(BusinessHolidayDto)
  async updateBusinessHoliday(
    @Param('business_holiday_id') businessHolidayId: string,
    @Body() body: UpdateBusinessHolidayDto,
  ): Promise<BusinessHoliday> {
    const businessHoliday = await this.businessHolidaysService.update(businessHolidayId, body)
    return businessHoliday
  }

  @Delete('business-holidays/:business_holiday_id')
  @UseGuards(AdminGuard)
  @Serialize(BusinessHolidayDto)
  @HttpCode(204)
  async deleteBusinessHoliday(
    @Param('business_holiday_id') businessHolidayId: string
  ): Promise<void> {
    return this.businessHolidaysService.delete(businessHolidayId)
  }
}
