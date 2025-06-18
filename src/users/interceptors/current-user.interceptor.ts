import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const { userId } = request.session

    if (userId) {
      const user = await this.usersService.findOne(userId)
      // requestにcurrentUserを含める
      // このインターセプター実行後にカスタムデコレータが実行されるので、
      // その時にリクエストからcurrentUserを取得できる
      request.currentUser = user
    }

    return handler.handle()
  }
}
