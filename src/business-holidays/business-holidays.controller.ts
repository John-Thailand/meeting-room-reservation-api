import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { BusinessHolidaysService } from './business-holidays.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { BusinessHoliday } from './business-holiday.entity';
import { CreateBusinessHolidayDto } from './dtos/create-business-holiday.dto';

@Controller('coworking-spaces/:coworkingSpaceId/business-holidays')
export class BusinessHolidaysController {
  constructor(
    private businessHolidaysService: BusinessHolidaysService
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async createBusinessHolidays(
    @Param('coworkingSpaceId') coworkingSpaceId: string,
    @Body() body: CreateBusinessHolidayDto,
  ): Promise<BusinessHoliday> {
    const businessHoliday = await this.businessHolidaysService.create(coworkingSpaceId, body.business_holiday)
    return businessHoliday
  }
}
