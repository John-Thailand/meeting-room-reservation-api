import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoom } from './meeting-room.entity';
import { CreateMeetingRoomDto } from './dtos/create-meeting-room.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { MeetingRoomDto } from './dtos/meeting-room.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateMeetingRoomDto } from './dtos/update-meeting-room.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller()
@Serialize(MeetingRoomDto)
export class MeetingRoomsController {
  constructor(private meetingRoomsService: MeetingRoomsService) {}

  @Get('coworking-spaces/:coworking_space_id/meeting-rooms')
  @UseGuards(AuthGuard)
  async getMeetingRooms(
    @Param('coworking_space_id') coworkingSpaceId: string
  ): Promise<MeetingRoom[]> {
    const meetingRooms = await this.meetingRoomsService.find(coworkingSpaceId)
    return meetingRooms
  }

  @Post('coworking-spaces/:coworking_space_id/meeting-rooms')
  @UseGuards(AdminGuard)
  async createMeetingRoom(
    @Param('coworking_space_id') coworkingSpaceId: string,
    @Body() body: CreateMeetingRoomDto,
  ): Promise<MeetingRoom> {
    const meetingRoom = await this.meetingRoomsService.create(coworkingSpaceId, body.name)
    return meetingRoom
  }

  @Patch('meeting-rooms/:meeting_room_id')
  @UseGuards(AdminGuard)
  async updateMeetingRoom(
    @Param('meeting_room_id') meetingRoomId: string,
    @Body() body: UpdateMeetingRoomDto,
  ): Promise<MeetingRoom> {
    const meetingRoom = await this.meetingRoomsService.update(meetingRoomId, body)
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
