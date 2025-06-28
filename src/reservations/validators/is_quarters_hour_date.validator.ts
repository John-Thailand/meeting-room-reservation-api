import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

// カスタムバリデーションデコレータ
// リクエストボディのプロパティの値をチェックする
// validationOptions: このデコレータが受け取るオプション
export function IsQuartersHourDate() {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsQuartersHourDate', // 識別名
      // どのクラスにこのバリデーションを紐づけるか
      // 例（object.constructor = class CreateMyReservationDto）
      target: object.constructor,
      propertyName, // 例：start_datetime end_datetime
      constraints: [], // 外部から渡された制約値を validator.validate() や defaultMessage() で使うための配列
      validator: {
        validate(value: any, args: ValidationArguments) {
          // そもそもDate型の値かどうか確認しておく
          if (!(value instanceof Date)) {
            return false
          }

          // ミリ秒や秒は0であるか確認しておく
          const milliseconds = value.getMilliseconds()
          if (milliseconds !== 0) {
            return false
          }

          const seconds = value.getSeconds()
          if (seconds !== 0) {
            return false
          }

          // 15分間隔の場合は問題なし
          const minutes = value.getMinutes()
          return minutes % 15 === 0
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in 15-minute intervals.`
        }
      }
    })
}
