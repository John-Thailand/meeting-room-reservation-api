import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { MeetingRoomsService } from 'src/meeting-rooms/meeting-rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { MeetingRoom } from 'src/meeting-rooms/meeting-room.entity';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { CoworkingSpace } from 'src/coworking-spaces/coworking-space.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { BusinessHoliday } from 'src/business-holidays/business-holiday.entity';
import { BusinessHolidaysService } from 'src/business-holidays/business-holidays.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, MeetingRoom, CoworkingSpace, User, BusinessHoliday])],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    MeetingRoomsService,
    CoworkingSpacesService,
    UsersService,
    BusinessHolidaysService
  ]
})
export class ReservationsModule {}
