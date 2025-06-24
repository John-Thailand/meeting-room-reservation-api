import { Module } from '@nestjs/common';
import { BusinessHolidaysController } from './business-holidays.controller';
import { BusinessHolidaysService } from './business-holidays.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHoliday } from './business-holiday.entity';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { CoworkingSpace } from 'src/coworking-spaces/coworking-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHoliday, CoworkingSpace])],
  controllers: [BusinessHolidaysController],
  providers: [BusinessHolidaysService, CoworkingSpacesService]
})
export class BusinessHolidaysModule {}
