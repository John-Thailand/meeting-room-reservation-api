import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsQuartersHourDate(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsQuartersHourDate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // そもそもDate型の値かどうか確認しておく
          if (!(value instanceof Date)) {
            return false
          }

          // ミリ秒や秒は0であるか確認しておく
          const milliseconds = value.getMilliseconds()
          console.log(milliseconds)
          if (milliseconds !== 0) {
            return false
          }

          const seconds = value.getSeconds()
          console.log(seconds)
          if (seconds !== 0) {
            return false
          }

          // 15分間隔の場合は問題なし
          const minutes = value.getMinutes()
          console.log(minutes)
          return minutes % 15 === 0
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in 15-minute intervals.`
        }
      }
    })
}
