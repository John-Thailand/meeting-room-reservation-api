import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cookie-Sessionミドルウェアを導入し、セッション管理を可能にする
  // セッション情報をクッキーに直接保存する
  // app.useでExpressのミドルウェアを登録し、NestJSで実装したミドルウェアはconfigure()で登録する
  app.use(cookieSession({
    // セッションデータの暗号化に使用される秘密鍵
    keys: ['asdfasdf']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      // DTOでデフォルト値を設定する（order = 'desc'）場合に必要
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
