import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './meeting-room.entity';
import { Repository } from 'typeorm';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { UpdateMeetingRoomDto } from './dtos/update-meeting-room.dto';

@Injectable()
export class MeetingRoomsService {
  constructor(
    @InjectRepository(MeetingRoom) private repo: Repository<MeetingRoom>,
    private coworkingSpacesService: CoworkingSpacesService,
  ) {}

  async find(coworkingSpaceId: string): Promise<MeetingRoom[]> {
    const coworkingSpace = await this.coworkingSpacesService.findOne(coworkingSpaceId)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    return this.repo.find({
      where: {
        is_deleted: false,
        coworking_space_id: coworkingSpaceId
      }
    })
  }

  async findOne(id: string): Promise<MeetingRoom> {
    // idがnullだとfindOneByは最初の要素を返してしまう
    if (!id) {
      return null
    }
    return this.repo.findOneBy({ id })
  }

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
      name,
      is_deleted: false
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

  async update(
    id: string,
    attrs: Partial<MeetingRoom>,
  ): Promise<MeetingRoom> {
    // 会議室が存在しない場合、エラーを返す
    const existingMeetingRoom = await this.repo.findOneBy({ id, is_deleted: false })
    if (!existingMeetingRoom) {
      throw new NotFoundException('meeting room not found')
    }

    // コワーキングスペースが存在しない場合、エラーを返す
    const existingCoworkingSpace = await this.coworkingSpacesService.findOne(attrs.coworking_space_id)
    if (!existingCoworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    // そのコワーキングスペースに名前が同じ会議室がある場合、エラーを返す
    if (existingMeetingRoom.coworking_space_id !== attrs.coworking_space_id) {
      const sameMeetingRoom = await this.repo.findOneBy({ name: attrs.name, is_deleted: false })
      if (sameMeetingRoom) {
        throw new BadRequestException('already exist the meeting room')
      }
    }

    Object.assign(existingMeetingRoom, attrs)
    return this.repo.save(existingMeetingRoom)
  }

  async delete(id: string): Promise<void> {
    // もし会議室が存在しない場合、エラーを返す
    const existingMeetingRoom = await this.repo.findOneBy({ id, is_deleted: false })
    if (!existingMeetingRoom) {
      throw new NotFoundException('meeting room not found')
    }

    existingMeetingRoom.is_deleted = true
    await this.repo.save(existingMeetingRoom)
  }
}
