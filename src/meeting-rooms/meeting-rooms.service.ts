import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './meeting-room.entity';
import { Repository } from 'typeorm';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';

@Injectable()
export class MeetingRoomsService {
  constructor(
    @InjectRepository(MeetingRoom) private repo: Repository<MeetingRoom>,
    private coworkingSpacesService: CoworkingSpacesService,
  ) {}

  async create(
    coworkingSpaceId: string,
    name: string,
  ): Promise<MeetingRoom> {
    // コワーキングスペースが存在しない場合、エラーを返す
    const coworkingSpace = await this.coworkingSpacesService.findOne(coworkingSpaceId)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    // そのコワーキングスペースに同じ名前の会議室が既に存在している場合、エラーを返す
    const existingMeetingRoom = await this.repo.findOneBy({
      coworking_space_id: coworkingSpace.id,
      name
    })
    if (existingMeetingRoom) {
      throw new BadRequestException('already exist the meeting room')
    }

    const meetingRoom = this.repo.create({
      coworking_space_id: coworkingSpaceId,
      name
    })

    return this.repo.save(meetingRoom)
  }
}
