import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateMyReservationDto } from './dtos/create-my-reservation.dto';
import { MeetingRoomsService } from 'src/meeting-rooms/meeting-rooms.service';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private repo: Repository<Reservation>,
    private meetingRoomsService: MeetingRoomsService,
    private coworkingSpaces: CoworkingSpacesService,
  ) {}

  async createMyReservation(
    userId: string,
    dto: CreateMyReservationDto,
  ): Promise<Reservation> {
    // 会議室が存在しない場合はエラーを返す
    const meetingRoom = await this.meetingRoomsService.findOne(dto.meeting_room_id)
    if (!meetingRoom) {
      throw new NotFoundException('meeting room not found')
    }

    // 今月分の予約かどうか
    const now = new Date()
    const thisYear = now.getFullYear()
    const thisMonth = now.getMonth()
    console.log(thisYear)
    console.log(thisMonth)
    if (
      dto.start_datetime.getFullYear() !== thisYear || dto.start_datetime.getMonth() !== thisMonth
      || dto.end_datetime.getFullYear() !== thisYear || dto.end_datetime.getMonth() !== thisMonth
    ) {
      throw new BadRequestException('you must reserve the meeting room for this month')
    }

    // 開始日時 < 終了日時か
    if (dto.start_datetime >= dto.end_datetime) {
      throw new BadRequestException('end date must be later than start date')
    }

    // 予約時間が15・30・45・60分のいずれか
    const diffInMilliSeconds = dto.end_datetime.getTime() - dto.start_datetime.getTime()
    const diffInMinutes = diffInMilliSeconds / (1000 * 60)

    if (![15, 30, 45, 60].includes(diffInMinutes)) {
      throw new BadRequestException('reservation time must be 15, 30, 45 or 60 minutes')
    }

    // 会議室の開店時間〜閉店時間内の予約かどうかチェック
    const coworkingSpace = await this.coworkingSpaces.findOne(meetingRoom.id)
    if (!coworkingSpace) {
      throw new BadRequestException('coworking space not found')
    }

    const openTime = new Date(dto.start_datetime)
    const closeTime = new Date(dto.end_datetime)
    const [openHour, openMinute, openSecond] = coworkingSpace.open_time.split(':').map(Number);
    const [closeHour, closeMinute, closeSecond] = coworkingSpace.close_time.split(':').map(Number);
    openTime.setHours(openHour, openMinute, 0, 0)
    closeTime.setHours(closeHour, closeMinute, 0, 0)

    if (dto.start_datetime < openTime || dto.end_datetime > closeTime) {
      throw new BadRequestException('reservation must be within coworking space business hours')
    }

    // ユーザーは１ヶ月に6回分まで会議室の予約ができる
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    const myThisMonthReservationCount = await this.repo
      .createQueryBuilder()
      .where('user_id = :user_id', {
        user_id: userId
      })
      .andWhere('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('end_datetime BETWEEN :start_of_this_month AND : end_of_this_month', {
        start_of_this_month: startOfThisMonth,
        end_of_this_month: endOfThisMonth
      })
      .getCount()

    if (myThisMonthReservationCount >= 6) {
      throw new BadRequestException('only reserve a meeting room six times a month')
    }

    // すでにその会議室でその時間で予約をしているかどうか
    const overlapCount = await this.repo
      .createQueryBuilder()
      .where('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('meeting_room_id = :meeting_room_id', {
        meeting_room_id: dto.meeting_room_id
      })
      .andWhere('start_datetime < :end_reservation_datetime AND end_datetime > :start_reservation_datetime ', {
        start_of_this_month: startOfThisMonth,
        end_of_this_month: endOfThisMonth
      })
      .getCount()

    if (overlapCount > 0) {
      throw new BadRequestException('the meeting room is already reserved for the datetime')
    }

    // 会議室の予約を実行
    const myReservation = this.repo.create({
      user_id: userId,
      meeting_room_id: dto.meeting_room_id,
      start_datetime: dto.start_datetime,
      end_datetime: dto.end_datetime
    })

    return this.repo.save(myReservation)
  }
}
