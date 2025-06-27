import { Module } from '@nestjs/common';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { MeetingRoomsService } from './meeting-rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './meeting-room.entity';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { CoworkingSpace } from 'src/coworking-spaces/coworking-space.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, CoworkingSpace, User])],
  controllers: [MeetingRoomsController],
  providers: [MeetingRoomsService, CoworkingSpacesService, UsersService]
})
export class MeetingRoomsModule {}
