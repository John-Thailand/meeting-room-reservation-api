import { Injectable, NestMiddleware } from "@nestjs/common";
import { UsersService } from "../users.service";
import { NextFunction } from "express";

// Middleware: HTTPリクエストとレスポンスの間に割り込んで何らかの処理を行う関数
// 全てのリクエストの前処理
// Middlewareの役割：リクエストの加工（req.currentUserを設定）
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const { userId } = req.session || {}

    if (userId) {
      const user = await this.usersService.findOne(userId)
      // @ts-ignore
      req.currentUser = user
    }

    // 現在のMiddlewareの処理が完了したことを伝えて、次のMiddlewareやルートハンドラーに進めるための関数
    // Request -> Middleware A -> Middleware B -> Controller -> Response
    next()
  }
}
