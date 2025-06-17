import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cookie-Sessionミドルウェアを導入し、セッション管理を可能にする
  // セッション情報をクッキーに直接保存する
  app.use(cookieSession({
    // セッションデータの暗号化に使用される秘密鍵
    keys: ['asdfasdf']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
