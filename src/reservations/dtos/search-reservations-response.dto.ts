import { Expose, Type } from "class-transformer";
import { ReservationDto } from "./reservation.dto";

export class SearchReservationsResponseDto {
  @Expose()
  @Type(() => ReservationDto)
  reservations: ReservationDto[];

  @Expose()
  total: number;
}
