import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

// ガード： ルート（エンドポイント）へのアクセスを「許可するかどうか」を判断する
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const userId = request.session.userId

    const user = await this.usersService.findOne(userId)

    return !!user
  }
}
