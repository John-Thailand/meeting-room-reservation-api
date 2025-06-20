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

    // ユーザーが存在しない場合は、エンドポイントへのアクセスを許可しない
    if (!user) {
      return false
    }

    // 管理者の場合は、必ずエンドポイントへのアクセスを許可する
    if (user.is_administrator) {
      return true
    }

    // 一般ユーザーの場合は、契約期間中はエンドポイントへのアクセスを許可する
    const today = new Date()
    const contractStartDate = new Date(user.contract_start_date)
    const withdrawalDate = user.withdrawal_date ? new Date(user.withdrawal_date) : null

    const isContractPeriod =
      contractStartDate <= today && (!withdrawalDate || today <= withdrawalDate)
    return isContractPeriod
  }
}
