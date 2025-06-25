import { Module } from '@nestjs/common';
import { BusinessHolidaysController } from './business-holidays.controller';
import { BusinessHolidaysService } from './business-holidays.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHoliday } from './business-holiday.entity';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { CoworkingSpace } from 'src/coworking-spaces/coworking-space.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHoliday, CoworkingSpace, User])],
  controllers: [BusinessHolidaysController],
  providers: [BusinessHolidaysService, CoworkingSpacesService, UsersService]
})
export class BusinessHolidaysModule {}
