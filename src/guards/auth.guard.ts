import { CanActivate, ExecutionContext } from "@nestjs/common";

// ガード： ルート（エンドポイント）へのアクセスを「許可するかどうか」を判断する
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    return request.session.userId
  }
}
