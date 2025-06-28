import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateMyReservationDto } from './dtos/create-my-reservation.dto';
import { Reservation } from './reservation.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReservationDto } from './dtos/reservation.dto';

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
}
