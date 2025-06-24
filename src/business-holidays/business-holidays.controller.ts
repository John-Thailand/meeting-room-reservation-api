import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { BusinessHolidaysService } from './business-holidays.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { BusinessHoliday } from './business-holiday.entity';
import { CreateBusinessHolidayDto } from './dtos/create-business-holiday.dto';

@Controller()
export class BusinessHolidaysController {
  constructor(
    private businessHolidaysService: BusinessHolidaysService
  ) {}

  @Post('coworking-spaces/:coworking_space_id/business-holidays')
  @UseGuards(AdminGuard)
  async createBusinessHoliday(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Body() body: CreateBusinessHolidayDto,
  ): Promise<BusinessHoliday> {
    const businessHoliday = await this.businessHolidaysService.create(coworkingSpaceId, body.business_holiday)
    return businessHoliday
  }

  @Delete('business-holidays/:business_holiday_id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async deleteBusinessHoliday(
    @Param('business_holiday_id') businessHolidayId: string
  ): Promise<void> {
    return this.businessHolidaysService.delete(businessHolidayId)
  }
}
