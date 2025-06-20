import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
  ]
})
export class UsersModule {
  // NestJSが提供するミドルウェア登録用メソッド
  configure(consumer: MiddlewareConsumer) {
    // CurrentUserMiddlewareを使うように指定
    // forRoutes('*')でモジュール配下の全ルートに対してミドルウェアを適用
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
