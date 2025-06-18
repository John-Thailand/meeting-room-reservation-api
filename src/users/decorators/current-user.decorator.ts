import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// パラメータデコレータ
// コントローラーのハンドラメソッドの引数に対してカスタムデータを注入するための仕組み
// 例：getProfile(@CurrentUser() user: string) {
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // パラメータデコレータはDIシステムの外部に存在します。
    // そのため、デコレータはユーザーサービスのインスタンスを取得できません
    // なのでインターセプターでユーザーサービスからユーザー情報を取得し、デコレータに返すようにする
    const request = context.switchToHttp().getRequest()
    return request.currentUser
  },
)
