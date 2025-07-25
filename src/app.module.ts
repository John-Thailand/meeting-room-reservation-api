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
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    // https://docs.nestjs.com/security/rate-limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
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
          type: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          entities: [User, CoworkingSpace, BusinessHoliday, MeetingRoom, Reservation],
          synchronize: false,
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
