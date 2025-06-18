import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// パラメータデコレータ
// コントローラーのハンドラメソッドの引数に対してカスタムデータを注入するための仕組み
// 例：getProfile(@CurrentUser() user: string) {
export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return 'hi there'
  },
)
