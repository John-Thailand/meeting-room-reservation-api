import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CoworkingSpacesModule } from './coworking-spaces/coworking-spaces.module';
import { CoworkingSpace } from "./coworking-spaces/coworking-space.entity";
import { BusinessHolidaysModule } from './business-holidays/business-holidays.module';

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
          entities: [User, CoworkingSpace],
          synchronize: true,
        }
      }
    }),
    UsersModule,
    CoworkingSpacesModule,
    BusinessHolidaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
