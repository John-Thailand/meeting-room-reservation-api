import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateMyReservationDto } from './dtos/create-my-reservation.dto';
import { MeetingRoomsService } from 'src/meeting-rooms/meeting-rooms.service';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';

import * as moment from 'moment-timezone'
import { BusinessHolidaysService } from 'src/business-holidays/business-holidays.service';
import { SearchReservationsRequestDto } from './dtos/search-reservations-request.dto';
import { SearchReservationsResponseDto } from './dtos/search-reservations-response.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private repo: Repository<Reservation>,
    private meetingRoomsService: MeetingRoomsService,
    private coworkingSpacesService: CoworkingSpacesService,
    private businessHolidaysService: BusinessHolidaysService,
    private usersService: UsersService,
  ) {}

  async createReservation(
    dto: CreateReservationDto
  ): Promise<Reservation> {
    // ユーザーが存在しない場合はエラーを返す
    const existingUser = await this.usersService.findOne(dto.user_id)
    if (!existingUser) {
      throw new BadRequestException('user not found')
    }

    // 会議室が存在しない場合はエラーを返す
    const meetingRoom = await this.meetingRoomsService.findOne(dto.meeting_room_id)
    if (!meetingRoom) {
      throw new NotFoundException('meeting room not found')
    }

    // 今月分の予約かどうか
    const nowJst = moment().tz('Asia/Tokyo')

    const startJst = moment(dto.start_datetime).tz('Asia/Tokyo')
    const endJst = moment(dto.end_datetime).tz('Asia/Tokyo')

    if (startJst.month() !== nowJst.month() || startJst.year() !== nowJst.year() ||
        endJst.month() !== nowJst.month() || endJst.year() !== nowJst.year()
    ) {
      throw new BadRequestException('you must reserve the meeting room for this month')
    }

    // 現在日時以降の予約か
    if (startJst.toDate() <= nowJst.toDate() || endJst.toDate() <= nowJst.toDate()) {
      throw new BadRequestException('you must make a reservation after now')
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
    const coworkingSpace = await this.coworkingSpacesService.findOne(meetingRoom.coworking_space_id)
    if (!coworkingSpace) {
      throw new BadRequestException('coworking space not found')
    }

    const [openHour, openMinute] = coworkingSpace.open_time.split(':').map(Number)
    const [closeHour, closeMinute] = coworkingSpace.close_time.split(':').map(Number)

    const startHour = startJst.hour()
    const startMinute = startJst.minute()
    const endHour = endJst.hour()
    const endMinute = endJst.minute()

    const isStartInBusinessHours =
      startHour > openHour || (startHour === openHour && startMinute >= openMinute)
    const isEndInBusinessHours =
      endHour < closeHour || (endHour === closeHour && endMinute <= closeMinute)

    if (!isStartInBusinessHours || !isEndInBusinessHours) {
      throw new BadRequestException('reservation must be within coworking space business hours')
    }

    // そのコワーキングスペースの休業日に会議室の予約をしていないか
    const date = new Date(
      dto.start_datetime.getFullYear(),
      dto.start_datetime.getMonth(),
      dto.start_datetime.getDate(),
    )
    const existingBusinessHoliday = await  this.businessHolidaysService.findOne(coworkingSpace.id, date)

    if (existingBusinessHoliday) {
      throw new BadRequestException('you can not reserve a meeting room on a holiday')
    }

    // ユーザーは１ヶ月に6回分まで会議室の予約ができる
    const startOfThisMonth = nowJst.clone().startOf('month').startOf('day').utc().toDate()
    const endOfThisMonth = nowJst.clone().endOf('month').endOf('day').utc().toDate()

    const myThisMonthReservationCount = await this.repo
      .createQueryBuilder()
      .where('user_id = :user_id', {
        user_id: dto.user_id
      })
      .andWhere('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('end_datetime BETWEEN :start_of_this_month AND :end_of_this_month', {
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
        start_reservation_datetime: startJst.toDate(),
        end_reservation_datetime: endJst.toDate()
      })
      .getCount()

    if (overlapCount > 0) {
      throw new BadRequestException('the meeting room is already reserved for the datetime')
    }

    // 会議室の予約を実行
    const myReservation = this.repo.create({
      user_id: dto.user_id,
      meeting_room_id: dto.meeting_room_id,
      start_datetime: dto.start_datetime,
      end_datetime: dto.end_datetime
    })

    return this.repo.save(myReservation)
  }

  async deleteReservation(
    reservationId: string
  ): Promise<void> {
    // その予約が存在しない場合、エラーを返す
    const reservation = await this.repo.findOneBy({
      id: reservationId,
      is_deleted: false
    })
    if (!reservation) {
      throw new BadRequestException('reservation not found')
    }

    reservation.is_deleted = true
    this.repo.save(reservation)
  }

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
    const nowJst = moment().tz('Asia/Tokyo')

    const startJst = moment(dto.start_datetime).tz('Asia/Tokyo')
    const endJst = moment(dto.end_datetime).tz('Asia/Tokyo')

    if (startJst.month() !== nowJst.month() || startJst.year() !== nowJst.year() ||
        endJst.month() !== nowJst.month() || endJst.year() !== nowJst.year()
    ) {
      throw new BadRequestException('you must reserve the meeting room for this month')
    }

    // 現在日時以降の予約か
    if (startJst.toDate() <= nowJst.toDate() || endJst.toDate() <= nowJst.toDate()) {
      throw new BadRequestException('you must make a reservation after now')
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
    const coworkingSpace = await this.coworkingSpacesService.findOne(meetingRoom.coworking_space_id)
    if (!coworkingSpace) {
      throw new BadRequestException('coworking space not found')
    }

    const [openHour, openMinute] = coworkingSpace.open_time.split(':').map(Number)
    const [closeHour, closeMinute] = coworkingSpace.close_time.split(':').map(Number)

    const startHour = startJst.hour()
    const startMinute = startJst.minute()
    const endHour = endJst.hour()
    const endMinute = endJst.minute()

    const isStartInBusinessHours =
      startHour > openHour || (startHour === openHour && startMinute >= openMinute)
    const isEndInBusinessHours =
      endHour < closeHour || (endHour === closeHour && endMinute <= closeMinute)

    if (!isStartInBusinessHours || !isEndInBusinessHours) {
      throw new BadRequestException('reservation must be within coworking space business hours')
    }

    // そのコワーキングスペースの休業日に会議室の予約をしていないか
    const date = new Date(
      dto.start_datetime.getFullYear(),
      dto.start_datetime.getMonth(),
      dto.start_datetime.getDate(),
    )
    const existingBusinessHoliday = await  this.businessHolidaysService.findOne(coworkingSpace.id, date)

    if (existingBusinessHoliday) {
      throw new BadRequestException('you can not reserve a meeting room on a holiday')
    }

    // ユーザーは１ヶ月に6回分まで会議室の予約ができる
    const startOfThisMonth = nowJst.clone().startOf('month').startOf('day').utc().toDate()
    const endOfThisMonth = nowJst.clone().endOf('month').endOf('day').utc().toDate()

    const myThisMonthReservationCount = await this.repo
      .createQueryBuilder()
      .where('user_id = :user_id', {
        user_id: userId
      })
      .andWhere('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('end_datetime BETWEEN :start_of_this_month AND :end_of_this_month', {
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
        start_reservation_datetime: startJst.toDate(),
        end_reservation_datetime: endJst.toDate()
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

  async updateMyReservation(
    id: string,
    attrs: Partial<Reservation>,
    userId: string,
  ): Promise<Reservation> {
    // その予約が存在しない場合はエラーを返す
    const existingMyReservation = await this.repo.findOneBy({
      id,
      user_id: userId,
      is_deleted: false,
    })
    if (!existingMyReservation) {
      throw new BadRequestException('your reservation does not exist')
    }

    const meetingRoomId = attrs.meeting_room_id ?? existingMyReservation.meeting_room_id
    const startDatetime = attrs.start_datetime ?? existingMyReservation.start_datetime
    const endDatetime = attrs.end_datetime ?? existingMyReservation.end_datetime

    // 会議室が存在しない場合はエラーを返す
    const meetingRoom = await this.meetingRoomsService.findOne(meetingRoomId)
    if (!meetingRoom) {
      throw new NotFoundException('meeting room not found')
    }

    // 今月分の予約かどうか
    const nowJst = moment().tz('Asia/Tokyo')

    const startJst = moment(startDatetime).tz('Asia/Tokyo')
    const endJst = moment(endDatetime).tz('Asia/Tokyo')

    if (startJst.month() !== nowJst.month() || startJst.year() !== nowJst.year() ||
        endJst.month() !== nowJst.month() || endJst.year() !== nowJst.year()
    ) {
      throw new BadRequestException('you must reserve the meeting room for this month')
    }

    // 現在日時以降の予約か
    if (startJst.toDate() <= nowJst.toDate() || endJst.toDate() <= nowJst.toDate()) {
      throw new BadRequestException('you must make a reservation after now')
    }

    // 開始日時 < 終了日時か
    if (startDatetime >= endDatetime) {
      throw new BadRequestException('end date must be later than start date')
    }

    // 予約時間が15・30・45・60分のいずれか
    const diffInMilliSeconds = endDatetime.getTime() - startDatetime.getTime()
    const diffInMinutes = diffInMilliSeconds / (1000 * 60)

    if (![15, 30, 45, 60].includes(diffInMinutes)) {
      throw new BadRequestException('reservation time must be 15, 30, 45 or 60 minutes')
    }

    // 会議室の開店時間〜閉店時間内の予約かどうかチェック
    const coworkingSpace = await this.coworkingSpacesService.findOne(meetingRoom.coworking_space_id)
    if (!coworkingSpace) {
      throw new BadRequestException('coworking space not found')
    }

    const [openHour, openMinute] = coworkingSpace.open_time.split(':').map(Number)
    const [closeHour, closeMinute] = coworkingSpace.close_time.split(':').map(Number)

    const startHour = startJst.hour()
    const startMinute = startJst.minute()
    const endHour = endJst.hour()
    const endMinute = endJst.minute()

    const isStartInBusinessHours =
      startHour > openHour || (startHour === openHour && startMinute >= openMinute)
    const isEndInBusinessHours =
      endHour < closeHour || (endHour === closeHour && endMinute <= closeMinute)

    if (!isStartInBusinessHours || !isEndInBusinessHours) {
      throw new BadRequestException('reservation must be within coworking space business hours')
    }

    // そのコワーキングスペースの休業日に会議室の予約をしていないか
    const date = new Date(
      startDatetime.getFullYear(),
      startDatetime.getMonth(),
      startDatetime.getDate(),
    )
    const existingBusinessHoliday = await  this.businessHolidaysService.findOne(coworkingSpace.id, date)

    if (existingBusinessHoliday) {
      throw new BadRequestException('you can not reserve a meeting room on a holiday')
    }

    // すでにその会議室でその時間で予約をしているかどうか
    const overlapCount = await this.repo
      .createQueryBuilder()
      .where('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('meeting_room_id = :meeting_room_id', {
        meeting_room_id: meetingRoomId
      })
      .andWhere('start_datetime < :end_reservation_datetime AND end_datetime > :start_reservation_datetime ', {
        start_reservation_datetime: startJst.toDate(),
        end_reservation_datetime: endJst.toDate()
      })
      .getCount()

    if (overlapCount > 0) {
      throw new BadRequestException('the meeting room is already reserved for the datetime')
    }

    Object.assign(existingMyReservation, attrs)
    return this.repo.save(existingMyReservation)
  }

  async deleteMyReservation(
    userId: string,
    reservationId: string
  ): Promise<void> {
    // その予約が存在しない場合、エラーを返す
    const reservation = await this.repo.findOneBy({
      id: reservationId,
      user_id: userId,
      is_deleted: false
    })
    if (!reservation) {
      throw new BadRequestException('reservation not found')
    }

    reservation.is_deleted = true
    this.repo.save(reservation)
  }

  async search(
    dto: SearchReservationsRequestDto,
  ): Promise<SearchReservationsResponseDto> {
    let query = this.repo
      .createQueryBuilder()
      .where('is_deleted = :is_deleted', {
        is_deleted: false
      })
      .andWhere('meeting_room_id = :meeting_room_id', {
        meeting_room_id: dto.meeting_room_id
      })
      .andWhere('start_datetime BETWEEN :start_date AND :end_date', {
        start_date: dto.start_date,
        end_date: dto.end_date
      })
      .orderBy('start_datetime', 'ASC')

    const reservations = await query.getMany()

    return {
      reservations,
      total: reservations.length,
    }
  }
}
