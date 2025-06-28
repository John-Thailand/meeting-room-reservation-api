import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CoworkingSpacesModule } from './coworking-spaces/coworking-spaces.module';
import { CoworkingSpace } from "./coworking-spaces/coworking-space.entity";
import { BusinessHolidaysModule } from './business-holidays/business-holidays.module';
import { BusinessHoliday } from "./business-holidays/business-holiday.entity";
import { MeetingRoomsModule } from './meeting-rooms/meeting-rooms.module';
import { MeetingRoom } from "./meeting-rooms/meeting-room.entity";
import { ReservationsModule } from './reservations/reservations.module';
import { Reservation } from "./reservations/reservation.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    // TypeORMを使ってSQLiteデータベースに接続するための初期設定
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, CoworkingSpace, BusinessHoliday, MeetingRoom, Reservation],
          synchronize: true,
        }
      }
    }),
    UsersModule,
    CoworkingSpacesModule,
    BusinessHolidaysModule,
    MeetingRoomsModule,
    ReservationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
