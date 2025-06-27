import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoom } from './meeting-room.entity';
import { CreateMeetingRoomDto } from './dtos/create-meeting-room.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { MeetingRoomDto } from './dtos/meeting-room.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller()
@Serialize(MeetingRoomDto)
export class MeetingRoomsController {
  constructor(private meetingRoomsService: MeetingRoomsService) {}

  @Post('coworking-spaces/:coworking_space_id/meeting-rooms')
  @UseGuards(AdminGuard)
  async createMeetingRoom(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Body() body: CreateMeetingRoomDto,
  ): Promise<MeetingRoom> {
    const meetingRoom = await this.meetingRoomsService.create(coworkingSpaceId, body.name)
    return meetingRoom
  }

  @Delete('meeting-rooms/:meeting_room_id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  async deleteMeetingRoom(
    @Param('meeting_room_id') meetingRoomId: string,
  ): Promise<void> {
    return await this.meetingRoomsService.delete(meetingRoomId)
  }
}
