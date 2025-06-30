import { Body, Controller, Delete, HttpCode, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateMyReservationDto } from './dtos/create-my-reservation.dto';
import { Reservation } from './reservation.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReservationDto } from './dtos/reservation.dto';
import { UpdateMyReservationDto } from './dtos/update-my-reservation.dto';

@Controller()
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post('users/me/reservations')
  @UseGuards(AuthGuard)
  @Serialize(ReservationDto)
  async createMyReservation(
    @Body() body: CreateMyReservationDto,
    @Session() session: any,
  ): Promise<Reservation> {
    const userId = session.userId as string
    const myReservation = await this.reservationsService.createMyReservation(
      userId,
      body,
    )
    return myReservation
  }

  @Patch('users/me/reservations/:id')
  @UseGuards(AuthGuard)
  @Serialize(ReservationDto)
  async updateMyReservation(
    @Param('id') id: string,
    @Body() body: UpdateMyReservationDto,
    @Session() session: any,
  ): Promise<Reservation> {
    const userId = session.userId as string
    const myReservation = await this.reservationsService.updateMyReservation(
      id,
      body,
      userId
    )
    return myReservation
  }

  @Delete('users/me/reservations/:id')
  @UseGuards(AuthGuard)
  @Serialize(ReservationDto)
  @HttpCode(204)
  async deleteMyReservation(
    @Param('id') id: string,
    @Session() session: any
  ): Promise<void> {
    const userId = session.userId as string
    await this.reservationsService.deleteMyReservation(userId, id)
  }
}
