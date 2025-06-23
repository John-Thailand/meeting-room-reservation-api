import { Module } from '@nestjs/common';
import { BusinessHolidaysController } from './business-holidays.controller';
import { BusinessHolidaysService } from './business-holidays.service';

@Module({
  controllers: [BusinessHolidaysController],
  providers: [BusinessHolidaysService]
})
export class BusinessHolidaysModule {}
