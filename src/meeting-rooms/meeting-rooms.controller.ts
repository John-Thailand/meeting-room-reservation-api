import { Body, Controller, Param, Post } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoom } from './meeting-room.entity';
import { CreateMeetingRoomDto } from './dtos/create-meeting-room.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { MeetingRoomDto } from './dtos/meeting-room.dto';

@Controller()
@Serialize(MeetingRoomDto)
export class MeetingRoomsController {
  constructor(private meetingRoomsService: MeetingRoomsService) {}

  @Post('coworking-spaces/:coworking_space_id/meeting-rooms')
  async createMeetingRoom(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Body() body: CreateMeetingRoomDto,
  ): Promise<MeetingRoom> {
    const meetingRoom = await this.meetingRoomsService.create(coworkingSpaceId, body.name)
    return meetingRoom
  }
}
